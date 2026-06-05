export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
};

export type Store = {
  username: string;
  name: string;
  description: string;
  logo: string;
  banner: string;
  whatsapp: string;
  products: Product[];
};

export const sampleStores: Store[] = [
  {
    username: "bloom",
    name: "Bloom & Co.",
    description: "Hand-tied bouquets and seasonal arrangements, delivered same-day.",
    logo: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=200&h=200&fit=crop",
    banner: "https://images.unsplash.com/photo-1487070183336-b863922373d4?w=1600&h=400&fit=crop",
    whatsapp: "15551234567",
    products: [
      { id: "1", name: "Garden Rose Bouquet", price: 48, description: "A dozen seasonal garden roses.", image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&h=600&fit=crop", stock: 12 },
      { id: "2", name: "Wildflower Mix", price: 36, description: "Locally sourced, hand-tied.", image: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=600&h=600&fit=crop", stock: 8 },
      { id: "3", name: "White Peony Bundle", price: 62, description: "Soft, fragrant, elegant.", image: "https://images.unsplash.com/photo-1469259943454-aa100abba749?w=600&h=600&fit=crop", stock: 5 },
      { id: "4", name: "Eucalyptus Wreath", price: 54, description: "Fresh dried eucalyptus.", image: "https://images.unsplash.com/photo-1509223197845-458d87318791?w=600&h=600&fit=crop", stock: 3 },
    ],
  },
  {
    username: "kioskcoffee",
    name: "Kiosk Coffee",
    description: "Specialty single origin coffee, roasted weekly in small batches.",
    logo: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop",
    banner: "https://images.unsplash.com/photo-1442975631115-c4f7b05b8a2c?w=1600&h=400&fit=crop",
    whatsapp: "15557654321",
    products: [
      { id: "1", name: "Ethiopia Yirgacheffe 250g", price: 22, description: "Bright, floral, citrus.", image: "https://images.unsplash.com/photo-1559525839-d9acfd510c84?w=600&h=600&fit=crop", stock: 30 },
      { id: "2", name: "Colombia Huila 250g", price: 20, description: "Caramel, milk chocolate.", image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop", stock: 25 },
      { id: "3", name: "Espresso Blend 500g", price: 32, description: "Balanced & sweet.", image: "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=600&h=600&fit=crop", stock: 18 },
    ],
  },
  {
    username: "linenhome",
    name: "Linen Home",
    description: "Soft, washed linen bedding and table goods.",
    logo: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=200&h=200&fit=crop",
    banner: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1600&h=400&fit=crop",
    whatsapp: "15559876543",
    products: [
      { id: "1", name: "Stonewashed Sheet Set", price: 180, description: "Queen, oatmeal.", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=600&fit=crop", stock: 10 },
      { id: "2", name: "Linen Table Runner", price: 42, description: "Natural flax.", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop", stock: 14 },
      { id: "3", name: "Pillowcase Pair", price: 58, description: "Soft & breathable.", image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&h=600&fit=crop", stock: 22 },
    ],
  },
];

export function getStore(username: string): Store | undefined {
  return sampleStores.find((s) => s.username === username);
}

export const mockOrders = [
  { id: "ORD-1041", customer: "Sara M.", items: 3, total: 132, status: "New", date: "Today, 2:14 PM" },
  { id: "ORD-1040", customer: "Liam K.", items: 1, total: 48, status: "Sent", date: "Today, 11:02 AM" },
  { id: "ORD-1039", customer: "Noor A.", items: 5, total: 210, status: "Sent", date: "Yesterday" },
  { id: "ORD-1038", customer: "Diego R.", items: 2, total: 84, status: "Sent", date: "Yesterday" },
  { id: "ORD-1037", customer: "Aiko T.", items: 1, total: 22, status: "Sent", date: "2 days ago" },
];

export const mockUsers = [
  { id: "u_01", name: "Bloom & Co.", email: "hello@bloom.co", username: "bloom", status: "Active", joined: "Mar 12, 2025", stores: 1 },
  { id: "u_02", name: "Kiosk Coffee", email: "team@kiosk.coffee", username: "kioskcoffee", status: "Active", joined: "Feb 28, 2025", stores: 1 },
  { id: "u_03", name: "Linen Home", email: "hi@linenhome.com", username: "linenhome", status: "Active", joined: "Jan 19, 2025", stores: 1 },
  { id: "u_04", name: "Sand Studio", email: "studio@sand.co", username: "sandstudio", status: "Suspended", joined: "Apr 02, 2025", stores: 1 },
  { id: "u_05", name: "Field Notes", email: "post@field.notes", username: "fieldnotes", status: "Active", joined: "Apr 18, 2025", stores: 1 },
];
