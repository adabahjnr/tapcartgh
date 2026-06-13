import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";
import { useAuth } from "./auth-context";

export type Hostel = {
  id: string;
  owner_id: string | null;
  name: string;
  description: string | null;
  location: string | null;
  distance_km: number | null;
  price_min: number | null;
  price_max: number | null;
  room_types: string[] | null;
  amenities: string[] | null;
  cover_image: string | null;
  gallery: string[] | null;
  contact_phone: string | null;
  contact_email: string | null;
  whatsapp: string | null;
  availability: "available" | "limited" | "full";
  is_verified: boolean;
  is_published: boolean;
  view_count: number;
  created_at: string;
};

export type Review = {
  id: string;
  hostel_id: string;
  user_id: string;
  rating: number;
  cleanliness: number | null;
  security: number | null;
  water: number | null;
  noise: number | null;
  internet: number | null;
  comment: string | null;
  approved: boolean;
  created_at: string;
};

export type AccommodationRequest = {
  id: string;
  user_id: string;
  budget_max: number | null;
  preferred_area: string | null;
  room_type: string | null;
  notes: string | null;
  status: string;
  created_at: string;
};

export type CommunitySignup = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
};

export type Feedback = {
  id: string;
  user_id: string | null;
  hostel_id: string | null;
  type: string | null;
  message: string;
  created_at: string;
};

export type AppRole = "admin" | "owner" | "student";

export function useRoles() {
  const { user } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!supabase || !user) {
      setRoles([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
    setRoles((data ?? []).map((r: { role: AppRole }) => r.role));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const isAdmin = roles.includes("admin");
  const isOwner = roles.includes("owner");
  return { roles, isAdmin, isOwner, loading, refetch };
}

export async function becomeOwner(userId: string) {
  if (!supabase) return { error: "Not configured" };
  const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "owner" });
  return { error: error?.message };
}

export function useHostels(filters?: {
  search?: string;
  maxPrice?: number;
  maxDistance?: number;
  availability?: string;
  verifiedOnly?: boolean;
  amenity?: string;
}) {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    setLoading(true);
    let q = supabase.from("hostels").select("*").eq("is_published", true).order("is_verified", { ascending: false }).order("created_at", { ascending: false });
    if (filters?.search) q = q.ilike("name", `%${filters.search}%`);
    if (filters?.maxPrice) q = q.lte("price_min", filters.maxPrice);
    if (filters?.maxDistance) q = q.lte("distance_km", filters.maxDistance);
    if (filters?.availability) q = q.eq("availability", filters.availability);
    if (filters?.verifiedOnly) q = q.eq("is_verified", true);
    if (filters?.amenity) q = q.contains("amenities", [filters.amenity]);
    q.then(({ data }) => {
      setHostels((data as Hostel[]) ?? []);
      setLoading(false);
    });
  }, [filters?.search, filters?.maxPrice, filters?.maxDistance, filters?.availability, filters?.verifiedOnly, filters?.amenity]);

  return { hostels, loading };
}

export function useHostel(id: string | undefined) {
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase || !id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from("hostels")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        setHostel((data as Hostel) ?? null);
        setLoading(false);
        // fire-and-forget view increment
        if (data) {
          supabase!
            .rpc("increment_hostel_view", { _id: id })
            .then(() => {})
            .then(undefined, () => {});
        }
      });
  }, [id]);

  return { hostel, loading };
}

export function useMyHostels() {
  const { user } = useAuth();
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!supabase || !user) {
      setHostels([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase.from("hostels").select("*").eq("owner_id", user.id).order("created_at", { ascending: false });
    setHostels((data as Hostel[]) ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { hostels, loading, refetch };
}

export function useReviews(hostelId: string | undefined) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!supabase || !hostelId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase.from("reviews").select("*").eq("hostel_id", hostelId).eq("approved", true).order("created_at", { ascending: false });
    setReviews((data as Review[]) ?? []);
    setLoading(false);
  }, [hostelId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { reviews, loading, refetch };
}

export function useFavorites() {
  const { user } = useAuth();
  const [ids, setIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!supabase || !user) {
      setIds([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase.from("favorites").select("hostel_id").eq("user_id", user.id);
    setIds((data ?? []).map((r: { hostel_id: string }) => r.hostel_id));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const toggle = async (hostelId: string) => {
    if (!supabase || !user) return;
    if (ids.includes(hostelId)) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("hostel_id", hostelId);
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, hostel_id: hostelId });
    }
    refetch();
  };

  return { ids, loading, toggle, refetch };
}

export function avgRating(reviews: Review[]) {
  if (!reviews.length) return 0;
  return reviews.reduce((a, r) => a + (r.rating ?? 0), 0) / reviews.length;
}
