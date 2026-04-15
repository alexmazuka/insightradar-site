import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getBlogPost, getBlogPosts } from "@/lib/blog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = getBlogPost(locale, slug);
  if (!post) return { title: "Not Found" };

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export async function generateStaticParams() {
  const locales = ["uk", "en"];
  const params: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    const posts = getBlogPosts(locale);
    for (const post of posts) {
      params.push({ locale, slug: post.slug });
    }
  }

  return params;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blog" });
  const post = getBlogPost(locale, slug);

  if (!post) notFound();

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Link
        href="/blog"
        className="text-sm text-primary hover:text-primary-light mb-8 inline-flex items-center gap-1"
      >
        &larr; {t("backToBlog")}
      </Link>

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <time className="text-sm text-text-muted">
            {t("publishedOn")} {post.date}
          </time>
          <span className="text-sm text-text-muted">|</span>
          <span className="text-sm text-text-muted">{post.author}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-text mb-4">
          {post.title}
        </h1>

        <p className="text-lg text-text-muted">{post.description}</p>

        <div className="flex gap-2 mt-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className="prose prose-lg max-w-none prose-headings:text-text prose-p:text-text-muted prose-a:text-primary">
        {post.content.split("\n\n").map((paragraph, i) => {
          if (paragraph.startsWith("## ")) {
            return <h2 key={i}>{paragraph.replace("## ", "")}</h2>;
          }
          if (paragraph.startsWith("### ")) {
            return <h3 key={i}>{paragraph.replace("### ", "")}</h3>;
          }
          if (paragraph.startsWith("- ")) {
            return (
              <ul key={i}>
                {paragraph.split("\n").map((item, j) => (
                  <li key={j}>{item.replace("- ", "")}</li>
                ))}
              </ul>
            );
          }
          return <p key={i}>{paragraph}</p>;
        })}
      </div>
    </article>
  );
}
