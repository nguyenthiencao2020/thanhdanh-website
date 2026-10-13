export type Settings = {
  company_name: string;
  short_name: string;
  tagline: string | null;
  about: string | null;
  phone: string | null;
  phone2: string | null;
  email: string | null;
  address: string | null;
  zalo: string | null;
  facebook: string | null;
  map_embed_url: string | null;
  business_hours: string | null;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
};

export type Brand = {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  sort_order: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  sku: string | null;
  category_id: string | null;
  brand_id: string | null;
  summary: string | null;
  description: string | null;
  image_url: string | null;
  price: string | null;
  featured: boolean;
  published: boolean;
};

export type ProductWithRelations = Product & {
  category: Pick<Category, "slug" | "name"> | null;
  brand: Pick<Brand, "slug" | "name" | "logo_url"> | null;
};

export type Inquiry = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  company: string | null;
  message: string | null;
  product_id: string | null;
  handled: boolean;
  created_at: string;
};
