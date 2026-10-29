import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : "*.supabase.co";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }],
  },
  // Categories replaced by the two-level tree (migration 0007) keep working for old links.
  async redirects() {
    return [
      { source: "/danh-muc-san-pham/thiet-bi-dien-cong-nghiep", destination: "/danh-muc-san-pham/thiet-bi-dong-cat", permanent: true },
    ];
  },
  // Admin guide: reachable by direct link only, kept out of search engines.
  async headers() {
    return [{ source: "/huong-dan-quan-tri.html", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
  experimental: {
    serverActions: { bodySizeLimit: "5mb" },
  },
};

export default nextConfig;
