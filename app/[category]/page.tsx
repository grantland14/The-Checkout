export const revalidate = 60
export const dynamicParams = true

import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import NewsletterSection from "@/components/newsletter-section"
import { getSiteSettings, getArticlesByCategory, getCategoryBySlug, getAllCategories } from "@/lib/queries"
import { urlFor } from "@/lib/sanity"

export async function generateStaticParams() {
  const categories = await getAllCategories()
  return categories.map((cat: { slug: { current: string } }) => ({
    category: cat.slug.current,
  }))
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const [siteSettings, categoryData, articles] = await Promise.all([
    getSiteSettings(),
    getCategoryBySlug(category),
    getArticlesByCategory(category, 20),
  ])

  if (!categoryData) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header siteSettings={siteSettings} />

      {/* Page Header */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="w-16 h-[3px] bg-foreground mb-8" />
          <h1 className="font-serif text-5xl lg:text-6xl tracking-tight mb-4">
            {categoryData.title}
          </h1>
          {categoryData.description && (
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl">
              {categoryData.description}
            </p>
          )}
        </div>
      </section>

      {/* Articles Grid */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          {articles && articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {articles.map(
                (article: {
                  _id: string
                  title: string
                  slug: { current: string }
                  excerpt?: string
                  publishedAt: string
                  featuredImage?: any
                  category?: { title: string; slug: { current: string } }
                  readingTime?: number
                }) => (
                  <Link
                    key={article._id}
                    href={`/article/${article.slug.current}`}
                    className="group card-lift block"
                  >
                    {/* Image */}
                    <div className="image-editorial aspect-[3/2] bg-card mb-4 relative">
                      {article.featuredImage ? (
                        <Image
                          src={urlFor(article.featuredImage)
                            .width(600)
                            .height(400)
                            .url()}
                          alt={article.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-card to-border" />
                      )}
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-3 mb-3">
                      {article.category && (
                        <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground">
                          {article.category.title.toUpperCase()}
                        </span>
                      )}
                      <span className="text-[10px] tracking-[0.2em] text-muted-foreground">
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
                    <h2 className="font-serif text-xl sm:text-2xl tracking-tight mb-2 headline-hover inline">
                      {article.title}
                    </h2>

                    {/* Excerpt */}
                    {article.excerpt && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                        {article.excerpt}
                      </p>
                    )}
                  </Link>
                )
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-12">
              No articles in this category yet.
            </p>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <NewsletterSection siteSettings={siteSettings} />

      <Footer siteSettings={siteSettings} />
    </div>
  )
}
