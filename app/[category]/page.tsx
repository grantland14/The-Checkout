export const revalidate = 60
export const dynamicParams = true

import { notFound } from "next/navigation"
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
    <>
      <Header siteSettings={siteSettings} />

      <main>
        {/* ───────────────── Hero Section ───────────────── */}
        <section className="border-b border-border py-16 lg:py-20">
          <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12">
            <div className="flex items-baseline gap-6 mb-4">
              <h1 className="font-serif text-5xl lg:text-6xl font-normal tracking-tight">
                {categoryData.title}
              </h1>
              <div className="hidden sm:block w-16 h-[2px] bg-foreground mb-1" />
            </div>
            {categoryData.description && (
              <p className="text-lg text-muted-foreground max-w-2xl">
                {categoryData.description}
              </p>
            )}
          </div>
        </section>

        {/* ───────────────── Articles List ───────────────── */}
        <section>
          {articles && articles.length > 0 ? (
            <div className="divide-y divide-border">
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
                    className="flex flex-col lg:flex-row gap-6 px-6 sm:px-8 lg:px-12 py-8 lg:py-10 hover:bg-card transition-all duration-500 group max-w-[1200px] mx-auto"
                  >
                    {/* Image */}
                    {article.featuredImage && (
                      <div className="w-full lg:w-80 h-48 bg-card shrink-0 image-editorial overflow-hidden">
                        <img
                          src={urlFor(article.featuredImage)
                            .width(1280)
                            .height(768)
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
                No articles in this category yet.
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
