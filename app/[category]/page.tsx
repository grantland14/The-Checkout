export const revalidate = 86400
export const dynamicParams = true

import { notFound } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import NewsletterSection from "@/components/newsletter-section"
import ArticleListWithLoadMore from "@/components/article-list-with-load-more"
import { PortableText, PortableTextComponents } from "@portabletext/react"
import { urlFor } from "@/lib/sanity"
import {
  getSiteSettings,
  getArticlesByCategory,
  getCategoryBySlug,
  getAllCategories,
  getPageBySlug,
  getAllPageSlugs,
} from "@/lib/queries"

const pagePortableTextComponents: PortableTextComponents = {
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

export async function generateStaticParams() {
  const [categories, pages] = await Promise.all([
    getAllCategories(),
    getAllPageSlugs(),
  ])
  return [
    ...categories.map((cat: { slug: { current: string } }) => ({
      category: cat.slug.current,
    })),
    ...pages.map((p: { slug: string }) => ({
      category: p.slug,
    })),
  ]
}

export default async function CategoryOrPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const [siteSettings, categoryData] = await Promise.all([
    getSiteSettings(),
    getCategoryBySlug(category),
  ])

  // If it's a category, render category page
  if (categoryData) {
    const articles = await getArticlesByCategory(category, 50)
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
                <div className="w-16 h-[2px] bg-foreground mb-1" />
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

  // Otherwise, check if it's a CMS page
  const page = await getPageBySlug(category)

  if (!page) {
    notFound()
  }

  return (
    <>
      <Header siteSettings={siteSettings} />

      <main>
        {/* ───────────────── Page Hero ───────────────── */}
        <section className="border-b border-border py-16 lg:py-20">
          <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12">
            <div className="w-16 h-[3px] bg-foreground mb-8" />
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl tracking-tight mb-6">
              {page.title}
            </h1>
            {page.excerpt && (
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl">
                {page.excerpt}
              </p>
            )}
          </div>
        </section>

        {/* ───────────────── Body Content ───────────────── */}
        {page.body && (
          <section className="border-b border-border">
            <div className="max-w-[720px] mx-auto px-6 sm:px-8 py-16 sm:py-24">
              <PortableText
                value={page.body}
                components={pagePortableTextComponents}
              />
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
