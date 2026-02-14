export const revalidate = 60
export const dynamicParams = true

import { notFound } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import NewsletterSection from "@/components/newsletter-section"
import ArticleListWithLoadMore from "@/components/article-list-with-load-more"
import { getSiteSettings, getArticlesByCategory, getCategoryBySlug, getAllCategories } from "@/lib/queries"

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
    getArticlesByCategory(category, 50),
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
            <ArticleListWithLoadMore articles={articles} initialCount={8} />
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
