import { useEffect, useState, useCallback } from "react";
import { supabase } from "./supabase";
import { useAuth } from "./auth-context";

export type Profile = {
  id: string;
  username: string;
  full_name: string | null;
  phone: string | null;
  store_name: string | null;
  whatsapp_number: string | null;
  avatar_url: string | null;
};

export type Product = {
  id: string;
  user_id: string;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
  stock: number | null;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  customer_name: string;
  total: number;
  items_count: number;
  status: string;
  created_at: string;
};

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!supabase || !user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
    setProfile((data as Profile) ?? null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const update = async (patch: Partial<Profile>) => {
    if (!supabase || !user) return { error: "Not signed in" };
    const { error } = await supabase.from("profiles").update(patch).eq("id", user.id);
    if (!error) await refetch();
    return { error: error?.message };
  };

  return { profile, loading, refetch, update };
}

export function useProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!supabase || !user) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setProducts((data as Product[]) ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const create = async (input: { name: string; price: number; description?: string; image_url?: string; stock?: number }) => {
    if (!supabase || !user) return { error: "Not signed in" };
    const { error } = await supabase.from("products").insert({ ...input, user_id: user.id });
    if (!error) await refetch();
    return { error: error?.message };
  };

  const remove = async (id: string) => {
    if (!supabase || !user) return { error: "Not signed in" };
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) await refetch();
    return { error: error?.message };
  };

  return { products, loading, refetch, create, remove };
}

export function useOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase || !user) {
      setOrders([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        setOrders((data as Order[]) ?? []);
        setLoading(false);
      });
  }, [user]);

  return { orders, loading };
}

export function useStoreViews() {
  const { user } = useAuth();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase || !user) {
      setCount(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from("store_views")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .then(({ count }) => {
        setCount(count ?? 0);
        setLoading(false);
      });
  }, [user]);

  return { count, loading };
}
