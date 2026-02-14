export const revalidate = 60
export const dynamicParams = true

import { notFound } from "next/navigation"
import Link from "next/link"
import { PortableText, PortableTextComponents } from "@portabletext/react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import NewsletterSection from "@/components/newsletter-section"
import { urlFor } from "@/lib/sanity"
import {
  getSiteSettings,
  getArticleBySlug,
  getAllArticleSlugs,
  getLatestArticles,
} from "@/lib/queries"

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs()
  return slugs.map((s: { slug: string }) => ({
    slug: s.slug,
  }))
}

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-foreground/85 text-[1.0625rem] leading-[1.85] mb-7">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight mt-12 mb-6">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight mt-10 mb-5">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-serif text-xl sm:text-2xl font-normal tracking-tight mt-8 mb-4">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="article-blockquote my-10">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors duration-500"
      >
        {children}
      </a>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-7 space-y-2 text-foreground/85 text-[1.0625rem] leading-[1.85]">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-7 space-y-2 text-foreground/85 text-[1.0625rem] leading-[1.85]">
        {children}
      </ol>
    ),
  },
  types: {
    image: ({ value }) => (
      <figure className="my-10">
        <img
          src={urlFor(value).width(1440).url()}
          alt={value.alt || ""}
          className="w-full"
        />
        {value.caption && (
          <figcaption className="text-sm text-muted-foreground mt-3">
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
  },
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

  // If no related articles are set, fall back to latest articles
  const hasRelated = article.relatedArticles && article.relatedArticles.length > 0
  const upNextArticles = hasRelated
    ? article.relatedArticles.slice(0, 3)
    : await getLatestArticles(3, article._id)

  return (
    <div className="min-h-screen bg-background">
      <Header siteSettings={siteSettings} />

      {/* Article Header */}
      <header>
        <div className="max-w-[720px] mx-auto px-6 sm:px-8 pt-16 sm:pt-20 lg:pt-24 pb-10">
          <div className="flex items-center gap-3 mb-8">
            {article.category && (
              <Link
                href={`/${article.category.slug.current}`}
                className="text-[10px] font-bold tracking-[0.2em] text-foreground hover:text-muted-foreground transition-colors duration-500"
              >
                {article.category.title?.toUpperCase()}
              </Link>
            )}
            <span className="w-6 h-[1.5px] bg-border" />
            {article.publishedAt && (
              <span className="text-[10px] tracking-[0.15em] text-muted-foreground">
                {formatDate(article.publishedAt)}
              </span>
            )}
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] font-normal tracking-[-0.02em] leading-[1.1] mb-8">
            {article.title}
          </h1>

          {/* Accent line */}
          <div className="w-16 h-[2px] bg-foreground mb-8" />

          {/* Excerpt / Lead */}
          {article.excerpt && (
            <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-[600px]">
              {article.excerpt}
            </p>
          )}

          {/* Author Byline */}
          {article.author && (
            <div className="flex items-center py-6 border-t border-b border-border">
              <Link
                href={`/author/${article.author.slug?.current}`}
                className="flex items-center gap-3 group"
              >
                <div className="w-9 h-9 bg-card rounded-full overflow-hidden shrink-0">
                  {article.author.photo ? (
                    <img
                      src={urlFor(article.author.photo)
                        .width(144)
                        .height(144)
                        .url()}
                      alt={article.author.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-border to-muted" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold leading-tight group-hover:text-muted-foreground transition-colors duration-500">{article.author.name}</p>
                  {article.author.role && (
                    <p className="text-xs text-muted-foreground">{article.author.role}</p>
                  )}
                </div>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Featured Image */}
      {article.featuredImage && (
        <div className="max-w-[720px] mx-auto px-6 sm:px-8 mb-10">
          <div className="image-editorial w-full aspect-[2/1] bg-card overflow-hidden">
            <img
              src={urlFor(article.featuredImage)
                .width(1440)
                .url()}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Article Body */}
      <article className="max-w-[720px] mx-auto px-6 sm:px-8">
        <div>
          {article.body && (
            <PortableText
              value={article.body}
              components={portableTextComponents}
            />
          )}
        </div>

        {/* Divider */}
        <div className="py-14 lg:py-16">
          <div className="w-16 h-[2px] bg-foreground" />
        </div>

        {/* Venice CTA */}
        {(() => {
          const cta = siteSettings?.veniceCta
          const tagline = cta?.tagline || "The room where 7-figure European founders connect."
          const highlights = cta?.highlightWords || ["7-figure", "connect"]
          const badge = cta?.badge || "VFN"
          const heading = cta?.heading || "A private network for European founders and operators."
          const description = cta?.description || "Venice Founders Network brings together the most ambitious DTC founders, operators, and investors building the future of European commerce. Dinners, deal flow, and direct introductions."
          const linkText = cta?.linkText || "Apply to Join"
          const linkUrl = cta?.linkUrl || "https://www.venicefounders.com/"

          // Build the tagline with highlighted words
          const renderTagline = () => {
            let result: React.ReactNode[] = []
            let remaining = tagline
            highlights.forEach((word: string, idx: number) => {
              const index = remaining.indexOf(word)
              if (index !== -1) {
                if (index > 0) {
                  result.push(remaining.slice(0, index))
                }
                result.push(
                  <span key={idx} className="bg-foreground text-background px-1.5 py-0.5">
                    {word}
                  </span>
                )
                remaining = remaining.slice(index + word.length)
              }
            })
            if (remaining) result.push(remaining)
            return result
          }

          return (
            <div className="-mx-6 sm:-mx-8 bg-card border-y border-border">
              <div className="max-w-[720px] mx-auto px-6 sm:px-8 py-14 sm:py-16">
                <div className="grid sm:grid-cols-2 gap-8">
                  {/* Left: Tagline */}
                  <div>
                    <p className="font-serif text-2xl sm:text-3xl tracking-tight leading-snug mb-4">
                      {renderTagline()}
                    </p>
                    <p className="text-[10px] font-bold tracking-[0.25em] text-muted-foreground">
                      {badge}
                    </p>
                  </div>

                  {/* Right: Description */}
                  <div className="flex flex-col justify-center">
                    <p className="font-bold text-sm mb-2">
                      {heading}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {description}
                    </p>
                    <a
                      href={linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold tracking-[0.2em] hover:text-muted-foreground transition-colors duration-500"
                    >
                      {`${linkText} -->`}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )
        })()}
        <div className="py-14 lg:py-16" />
      </article>

      {/* Up Next */}
      {upNextArticles && upNextArticles.length > 0 && (
        <section className="border-t border-border">
          <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12 py-20 lg:py-24">
            <div className="flex items-baseline gap-4 mb-14">
              <h2 className="font-serif text-5xl lg:text-6xl font-normal tracking-tight">Up Next</h2>
              <div className="hidden sm:block w-16 h-[2px] bg-foreground mb-2" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
              {upNextArticles.map((related: any) => (
                  <Link
                    key={related._id}
                    href={`/article/${related.slug.current}`}
                    className="group card-lift block"
                  >
                    {/* Image */}
                    <div className="image-editorial w-full aspect-[16/10] bg-card mb-5">
                      {related.featuredImage ? (
                        <img
                          src={urlFor(related.featuredImage)
                            .width(800)
                            .url()}
                          alt={related.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-border to-muted" />
                      )}
                    </div>

                    {/* Category */}
                    {related.category && (
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground">
                          {related.category.title?.toUpperCase()}
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="font-serif text-xl lg:text-2xl font-normal leading-snug mb-3">
                      <span className="headline-hover">{related.title}</span>
                    </h3>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <NewsletterSection siteSettings={siteSettings} />

      <Footer siteSettings={siteSettings} />
    </div>
  )
}
