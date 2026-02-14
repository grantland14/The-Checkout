export const revalidate = 60
export const dynamicParams = true

import { notFound } from "next/navigation"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import NewsletterSection from "@/components/newsletter-section"
import { getSiteSettings, getAuthorBySlug, getAllAuthorSlugs } from "@/lib/queries"
import { urlFor } from "@/lib/sanity"

export async function generateStaticParams() {
  const authors = await getAllAuthorSlugs()
  return authors.map((a: { slug: string }) => ({
    slug: a.slug,
  }))
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [siteSettings, author] = await Promise.all([
    getSiteSettings(),
    getAuthorBySlug(slug),
  ])

  if (!author) {
    notFound()
  }

  return (
    <>
      <Header siteSettings={siteSettings} />

      <main>
        {/* ───────────────── Author Header ───────────────── */}
        <section className="border-b border-border py-16 lg:py-20">
          <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12">
            <div className="flex flex-col sm:flex-row items-start gap-8">
              {/* Photo */}
              {author.photo ? (
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-card rounded-full overflow-hidden shrink-0">
                  <img
                    src={urlFor(author.photo)
                      .width(256)
                      .height(256)
                      .url()}
                    alt={author.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-border to-muted rounded-full shrink-0" />
              )}

              {/* Info */}
              <div className="flex-1">
                <h1 className="font-serif text-5xl lg:text-6xl font-normal tracking-tight mb-3">
                  {author.name}
                </h1>
                {author.role && (
                  <p className="text-sm font-semibold text-muted-foreground tracking-wide mb-4">
                    {author.role}
                  </p>
                )}
                {author.bio && (
                  <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mb-5">
                    {author.bio}
                  </p>
                )}

                {/* Social Links */}
                {(author.twitter || author.linkedin) && (
                  <div className="flex items-center gap-4">
                    {author.twitter && (
                      <a
                        href={author.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors duration-500"
                      >
                        X / TWITTER
                      </a>
                    )}
                    {author.twitter && author.linkedin && (
                      <span className="w-4 h-[1.5px] bg-border" />
                    )}
                    {author.linkedin && (
                      <a
                        href={author.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors duration-500"
                      >
                        LINKEDIN
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────── Articles by Author ───────────────── */}
        <section>
          {author.articles && author.articles.length > 0 ? (
            <div className="divide-y divide-border">
              {author.articles.map(
                (article: {
                  _id: string
                  title: string
                  slug: { current: string }
                  excerpt?: string
                  publishedAt: string
                  featuredImage?: any
                  category?: { title: string; slug: { current: string } }
                }) => (
                  <Link
                    key={article._id}
                    href={`/article/${article.slug.current}`}
                    className="flex flex-col lg:flex-row gap-6 px-6 sm:px-8 lg:px-12 py-8 lg:py-10 hover:bg-card transition-all duration-500 group max-w-[1200px] mx-auto"
                  >
                    {/* Image */}
                    {article.featuredImage && (
                      <div className="w-full lg:w-80 aspect-[5/3] lg:aspect-auto lg:h-48 bg-card shrink-0 image-editorial overflow-hidden">
                        <img
                          src={urlFor(article.featuredImage)
                            .width(800)
                            .url()}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1">
                      {/* Tag + Date */}
                      <div className="flex items-center gap-3 mb-3">
                        {article.category && (
                          <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground">
                            {article.category.title.toUpperCase()}
                          </span>
                        )}
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(article.publishedAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="font-serif text-2xl lg:text-3xl font-normal leading-snug mb-3">
                        <span className="headline-hover">{article.title}</span>
                      </h2>

                      {/* Excerpt */}
                      {article.excerpt && (
                        <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                          {article.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                )
              )}
            </div>
          ) : (
            <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12">
              <p className="text-muted-foreground text-center py-12">
                No articles by this author yet.
              </p>
            </div>
          )}
        </section>

        {/* ───────────────── Newsletter CTA ───────────────── */}
        <NewsletterSection siteSettings={siteSettings} />
      </main>

      <Footer siteSettings={siteSettings} />
    </>
  )
}
