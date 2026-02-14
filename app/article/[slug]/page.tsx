export const revalidate = 60
export const dynamicParams = true

import { notFound } from "next/navigation"
import Link from "next/link"
import { PortableText } from "@portabletext/react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import NewsletterSection from "@/components/newsletter-section"
import { urlFor } from "@/lib/sanity"
import {
  getSiteSettings,
  getArticleBySlug,
  getAllArticleSlugs,
} from "@/lib/queries"

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs()
  return slugs.map((s: { slug: string }) => ({
    slug: s.slug,
  }))
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const [article, siteSettings] = await Promise.all([
    getArticleBySlug(decodedSlug),
    getSiteSettings(),
  ])

  if (!article) {
    notFound()
  }

  return (
    <>
      <Header siteSettings={siteSettings} />

      <main>
        <article>
          {/* ───────────────── Article Header ───────────────── */}
          <header className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-10">
            {/* Tag + Date */}
            <div className="flex items-center gap-3 mb-6">
              {article.category && (
                <Link
                  href={`/${article.category.slug.current}`}
                  className="text-[9px] font-bold px-2.5 py-1 tracking-[0.15em] border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition"
                >
                  {article.category.title?.toUpperCase()}
                </Link>
              )}
              {article.publishedAt && (
                <span className="text-[11px] text-muted-foreground">
                  {formatDate(article.publishedAt)}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] mb-6">
              {article.title}
            </h1>

            {/* Accent Line */}
            <div className="w-16 h-[2px] bg-foreground mb-6" />

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8">
                {article.excerpt}
              </p>
            )}

            {/* Author Byline */}
            {article.author && (
              <div className="flex items-center gap-4 border-t border-b border-border py-4">
                {/* Avatar */}
                {article.author.photo && (
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-muted shrink-0">
                    <img
                      src={urlFor(article.author.photo)
                        .width(80)
                        .height(80)
                        .url()}
                      alt={article.author.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div>
                  <p className="text-sm font-bold">{article.author.name}</p>
                  {article.author.role && (
                    <p className="text-[11px] text-muted-foreground">
                      {article.author.role}
                    </p>
                  )}
                </div>

                {article.readingTime && (
                  <span className="ml-auto text-[11px] text-muted-foreground">
                    {article.readingTime} MIN READ
                  </span>
                )}
              </div>
            )}
          </header>

          {/* ───────────────── Featured Image ───────────────── */}
          {article.featuredImage && (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
              <div className="image-editorial aspect-[16/9] bg-muted overflow-hidden">
                <img
                  src={urlFor(article.featuredImage)
                    .width(1200)
                    .height(675)
                    .url()}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* ───────────────── Article Body ───────────────── */}
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
            <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:tracking-tight prose-a:text-foreground prose-a:underline prose-blockquote:article-blockquote prose-img:rounded-none">
              {article.body && <PortableText value={article.body} />}
            </div>
          </div>
        </article>

        {/* ───────────────── Venice CTA Card ───────────────── */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
          <div className="border border-border bg-card p-8 sm:p-10">
            <div className="grid sm:grid-cols-2 gap-8">
              {/* Left: Tagline */}
              <div>
                <p className="font-serif text-2xl sm:text-3xl tracking-tight leading-snug mb-4">
                  The room where{" "}
                  <span className="bg-foreground text-background px-1.5 py-0.5">
                    7-figure
                  </span>{" "}
                  European founders{" "}
                  <span className="bg-foreground text-background px-1.5 py-0.5">
                    connect
                  </span>
                  .
                </p>
                <p className="text-[10px] font-bold tracking-[0.25em] text-muted-foreground">
                  VFN
                </p>
              </div>

              {/* Right: Description */}
              <div className="flex flex-col justify-center">
                <p className="font-bold text-sm mb-2">
                  A private network for European founders and operators.
                </p>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Curated peer groups, exclusive events, and shared intelligence
                  for the founders scaling the next generation of European
                  consumer brands.
                </p>
                <a
                  href="https://www.venicefounders.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold tracking-[0.2em] hover:text-muted-foreground transition"
                >
                  Apply to Join --&gt;
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────── Up Next ───────────────── */}
        {article.relatedArticles && article.relatedArticles.length > 0 && (
          <section className="border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
              {/* Section heading */}
              <div className="flex items-center gap-4 mb-12">
                <h2 className="font-serif text-4xl sm:text-5xl tracking-tight">
                  Up Next
                </h2>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {article.relatedArticles
                  .slice(0, 3)
                  .map((related: any) => (
                    <Link
                      key={related._id}
                      href={`/article/${related.slug.current}`}
                      className="group card-lift"
                    >
                      {/* Image */}
                      {related.featuredImage && (
                        <div className="image-editorial aspect-[16/10] bg-muted overflow-hidden mb-4">
                          <img
                            src={urlFor(related.featuredImage)
                              .width(600)
                              .height(375)
                              .url()}
                            alt={related.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Category */}
                      {related.category && (
                        <span className="inline-block text-[9px] font-bold px-2.5 py-1 tracking-[0.15em] border border-border text-muted-foreground mb-3">
                          {related.category.title?.toUpperCase()}
                        </span>
                      )}

                      {/* Title */}
                      <h3 className="font-serif text-xl leading-snug headline-hover">
                        {related.title}
                      </h3>
                    </Link>
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* ───────────────── Newsletter CTA ───────────────── */}
        <NewsletterSection siteSettings={siteSettings} />
      </main>

      <Footer siteSettings={siteSettings} />
    </>
  )
}
