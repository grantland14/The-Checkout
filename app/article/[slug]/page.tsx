export const revalidate = 86400
export const dynamicParams = true

import { notFound } from "next/navigation"
import Link from "next/link"
import { PortableText, PortableTextComponents } from "@portabletext/react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import NewsletterSection from "@/components/newsletter-section"
import { urlFor } from "@/lib/sanity"
import type { Metadata } from "next"
import {
  getSiteSettings,
  getArticleBySlug,
  getAllArticleSlugs,
  getLatestArticles,
} from "@/lib/queries"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(decodeURIComponent(slug))
  if (!article) return { title: "Article Not Found" }

  const title = article.seo?.metaTitle || article.title
  const description = article.seo?.metaDescription || article.excerpt || undefined
  const ogImage = article.featuredImage
    ? urlFor(article.featuredImage).width(1200).height(630).url()
    : undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: article.publishedAt,
      authors: article.author?.name ? [article.author.name] : undefined,
      ...(ogImage && {
        images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
  }
}

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

  const siteUrl = siteSettings?.siteUrl || "https://thecheckout.media"
  const articleUrl = `${siteUrl}/article/${article.slug.current}`
  const ogImage = article.featuredImage
    ? urlFor(article.featuredImage).width(1200).height(630).url()
    : undefined

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    ...(article.excerpt && { description: article.excerpt }),
    ...(ogImage && { image: ogImage }),
    datePublished: article.publishedAt,
    url: articleUrl,
    ...(article.author && {
      author: {
        "@type": "Person",
        name: article.author.name,
        url: `${siteUrl}/author/${article.author.slug?.current}`,
      },
    }),
    publisher: {
      "@type": "Organization",
      name: siteSettings?.title || "The Checkout",
      url: siteUrl,
    },
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      ...(article.categories?.[0]
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: article.categories[0].title,
              item: `${siteUrl}/${article.categories[0].slug.current}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: article.categories?.[0] ? 3 : 2,
        name: article.title,
        item: articleUrl,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header siteSettings={siteSettings} />

      {/* Article Header */}
      <header>
        <div className="max-w-[720px] mx-auto px-6 sm:px-8 pt-16 sm:pt-20 lg:pt-24 pb-10">
          <div className="flex items-center gap-3 mb-8">
            {article.categories?.length > 0 && (
              <span className="text-[10px] font-bold tracking-[0.2em]">
                {article.categories.map((cat: any, i: number) => (
                  <span key={cat.slug.current}>
                    {i > 0 && <span className="text-muted-foreground mx-1.5">/</span>}
                    <Link
                      href={`/${cat.slug.current}`}
                      className="text-foreground hover:text-muted-foreground transition-colors duration-500"
                    >
                      {cat.title?.toUpperCase()}
                    </Link>
                  </span>
                ))}
              </span>
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
        <figure className="max-w-[720px] mx-auto px-6 sm:px-8 mb-10">
          <div className="image-editorial w-full aspect-[2/1] bg-card overflow-hidden">
            <img
              src={urlFor(article.featuredImage)
                .width(1440)
                .url()}
              alt={article.featuredImage.alt || article.title}
              className="w-full h-full object-cover"
            />
          </div>
          {article.featuredImage.caption && (
            <figcaption className="text-xs text-muted-foreground mt-3">
              {article.featuredImage.caption}
            </figcaption>
          )}
        </figure>
      )}

      {/* Article Body with Inline Subscribe CTA at ~40% */}
      <article className="max-w-[720px] mx-auto px-6 sm:px-8">
        {article.body && (() => {
          const blocks = article.body
          const targetIndex = Math.floor(blocks.length * 0.4)

          // Find a safe split point: after a normal paragraph block,
          // never directly after a heading (h2-h6) or inside a list.
          const isHeading = (b: any) =>
            b.style === "h1" || b.style === "h2" || b.style === "h3" ||
            b.style === "h4" || b.style === "h5" || b.style === "h6"
          const isList = (b: any) => b.listItem != null

          let splitIndex = targetIndex

          // Search forward from target for a safe spot (after a paragraph that isn't followed by a list)
          const findSafe = (start: number, direction: 1 | -1): number | null => {
            for (let i = start; direction === 1 ? i < blocks.length : i > 0; i += direction) {
              const prev = blocks[i - 1]
              const next = blocks[i]
              // Safe: previous block is a normal paragraph and next block is not a list continuation
              if (
                prev && !isHeading(prev) && !isList(prev) &&
                (!next || !isList(next))
              ) {
                return i
              }
            }
            return null
          }

          // Try forward first, then backward
          const safeForward = findSafe(targetIndex, 1)
          const safeBackward = findSafe(targetIndex, -1)

          if (safeForward !== null && safeBackward !== null) {
            // Pick whichever is closer to the target
            splitIndex = (safeForward - targetIndex) <= (targetIndex - safeBackward)
              ? safeForward : safeBackward
          } else if (safeForward !== null) {
            splitIndex = safeForward
          } else if (safeBackward !== null) {
            splitIndex = safeBackward
          }

          // Don't place CTA in the first 20% or last 20%
          const minIndex = Math.floor(blocks.length * 0.2)
          const maxIndex = Math.floor(blocks.length * 0.8)
          splitIndex = Math.max(minIndex, Math.min(maxIndex, splitIndex))

          const firstHalf = blocks.slice(0, splitIndex)
          const secondHalf = blocks.slice(splitIndex)

          return (
            <>
              <div>
                <PortableText value={firstHalf} components={portableTextComponents} />
              </div>

              {/* Inline Subscribe CTA */}
              <div className="-mx-6 sm:-mx-8 my-10 sm:my-12 bg-card border-y border-border">
                <div className="px-6 sm:px-8 py-10 sm:py-12">
                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
                    {siteSettings?.articleCtaSubtitle
                      || (siteSettings?.subscriberCount
                        ? `Join ${siteSettings.subscriberCount}+ founders, operators, and investors who read The Checkout every week.`
                        : "Join thousands of founders, operators, and investors who read The Checkout every week.")}
                  </p>
                  <form className="flex flex-col sm:flex-row gap-3 sm:gap-0">
                    <input
                      type="email"
                      placeholder="NAME@EMAIL.COM"
                      required
                      className="flex-1 bg-background border border-border px-5 py-4 text-sm font-medium tracking-widest placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors duration-500"
                    />
                    <button
                      type="submit"
                      className="bg-foreground text-background px-8 py-4 font-bold text-sm tracking-widest btn-subscribe transition-all duration-300 shrink-0"
                    >
                      {siteSettings?.articleCtaButtonText || "SUBSCRIBE FREE"}
                    </button>
                  </form>
                </div>
              </div>

              <div>
                <PortableText value={secondHalf} components={portableTextComponents} />
              </div>
            </>
          )
        })()}

        {/* Divider */}
        <div className="-mx-6 sm:-mx-8 mt-14 lg:mt-16 mb-10 lg:mb-12 border-t border-border" />

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
        <div className="pb-10 lg:pb-12" />
      </article>

      {/* Up Next */}
      {upNextArticles && upNextArticles.length > 0 && (
        <section className="border-t border-border">
          <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12 py-20 lg:py-24">
            <div className="flex items-baseline gap-4 mb-14">
              <h2 className="font-serif text-5xl lg:text-6xl font-normal tracking-tight">Up Next</h2>
              <div className="w-16 h-[2px] bg-foreground mb-2" />
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
                            .width(1200)
                            .url()}
                          alt={related.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-border to-muted" />
                      )}
                    </div>

                    {/* Category */}
                    {related.categories?.[0] && (
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground">
                          {related.categories[0].title?.toUpperCase()}
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
