import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBanner } from "@/components/CtaBanner";
import { Icon } from "@/components/Icon";
import { formatDate, PostCard } from "@/components/PostCard";
import { RichText } from "@/components/RichText";
import { ShareButtons } from "@/components/ShareButtons";
import { getPost, getPosts, getSettings } from "@/lib/data";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: { type: "article", publishedTime: post.published_at, images: post.cover_url ? [post.cover_url] : undefined },
  };
}

export default async function PostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getPost(slug), getSettings()]);
  if (!post) notFound();

  const sameCategory = post.category ? await getPosts({ category: post.category, limit: 4 }) : [];
  let related = sameCategory.filter((p) => p.id !== post.id).slice(0, 3);
  if (related.length < 3) {
    const more = (await getPosts({ limit: 6 })).filter((p) => p.id !== post.id && !related.some((r) => r.id === p.id));
    related = [...related, ...more].slice(0, 3);
  }
  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/tin-tuc/${post.slug}`;

  return (
    <article>
      <header className="relative isolate overflow-hidden bg-steel-900 text-white">
        <div className="bg-blueprint absolute inset-0 -z-10" />
        <div className="container-page max-w-4xl py-12 sm:py-16">
          <nav className="text-sm text-steel-100/70" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white">Trang chủ</Link> / <Link href="/tin-tuc" className="hover:text-white">Tin tức</Link> /{" "}
            <span className="text-white">{post.title}</span>
          </nav>
          {post.category && (
            <Link
              href={`/tin-tuc?danh-muc=${encodeURIComponent(post.category)}`}
              className="mt-5 inline-block rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold"
            >
              {post.category}
            </Link>
          )}
          <h1 className="mt-4 text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl lg:text-5xl">{post.title}</h1>
          <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-steel-100/80">
            <span className="flex items-center gap-1.5"><Icon name="clock" className="h-4 w-4" /> {formatDate(post.published_at)}</span>
            {post.author && <span className="flex items-center gap-1.5"><Icon name="shield" className="h-4 w-4" /> {post.author}</span>}
          </p>
        </div>
      </header>

      <div className="container-page max-w-4xl py-10">
        {post.cover_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.cover_url} alt={post.title} className="-mt-20 mb-10 aspect-[16/9] w-full rounded-3xl border border-slate-200 bg-white object-cover shadow-xl" />
        )}
        {post.excerpt && <p className="mb-6 text-lg leading-relaxed font-medium text-steel-700">{post.excerpt}</p>}
        <RichText text={post.content} className="text-[17px]" />

        <div className="mt-10 flex flex-col gap-5 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          {post.tags && post.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <Link key={t} href={`/tin-tuc?tag=${encodeURIComponent(t)}`} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-steel-100">
                  #{t}
                </Link>
              ))}
            </div>
          ) : (
            <span />
          )}
          <ShareButtons url={url} title={post.title} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="bg-slate-50 py-14">
          <div className="container-page">
            <h2 className="text-2xl font-bold text-steel-900">Bài viết liên quan</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {related.map((p) => <PostCard key={p.id} post={p} />)}
            </div>
          </div>
        </section>
      )}

      <div className="container-page pt-14">
        <CtaBanner phone={settings.phone} zalo={settings.zalo} />
      </div>
    </article>
  );
}
