export type Settings = {
  company_name: string;
  short_name: string;
  english_name: string | null;
  tax_code: string | null;
  license_info: string | null;
  tagline: string | null;
  about: string | null;
  phone: string | null;
  phone2: string | null;
  email: string | null;
  address: string | null;
  zalo: string | null;
  facebook: string | null;
  messenger_url: string | null;
  map_embed_url: string | null;
  business_hours: string | null;
  announcement: string | null;
  announcement_url: string | null;
  mission: string | null;
  vision: string | null;
  /** One value per line: "Title | description" */
  core_values: string | null;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  sort_order: number;
  parent_id?: string | null;
};

export type CategoryNode = Category & { children: Category[] };

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
  /** One spec per line: "Name | value" */
  specs: string | null;
  image_url: string | null;
  gallery: string[] | null;
  datasheet_url: string | null;
  in_stock: boolean | null;
  price: string | null;
  featured: boolean;
  published: boolean;
};

export type ProductWithRelations = Product & {
  category: Pick<Category, "slug" | "name"> | null;
  brand: Pick<Brand, "slug" | "name" | "logo_url"> | null;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_url: string | null;
  category: string | null;
  tags: string[] | null;
  author: string | null;
  featured: boolean;
  published: boolean;
  published_at: string;
};

export type Service = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  content: string | null;
  icon: string | null;
  sort_order: number;
};

export type Page = {
  id: string;
  slug: string;
  title: string;
  content: string | null;
  sort_order: number;
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

export type Banner = {
  id: string;
  title: string;
  subtitle: string | null;
  /** Photo for the slide. Without one the slide shows `collage` illustrations. */
  image_url: string | null;
  collage: string[] | null;
  cta_label: string | null;
  cta_url: string | null;
  sort_order: number;
  published: boolean;
};
