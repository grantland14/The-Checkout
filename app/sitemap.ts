import { client } from "@/lib/sanity"

export default async function sitemap() {
  const siteUrl = "https://thecheckout.media"

  // Fetch all dynamic content in parallel
  const [articles, categories, authors, pages] = await Promise.all([
    client.fetch(`*[_type == "article" && defined(slug.current)]{
      "slug": slug.current,
      _updatedAt
    }`),
    client.fetch(`*[_type == "category" && defined(slug.current)]{
      "slug": slug.current,
      _updatedAt
    }`),
    client.fetch(`*[_type == "author" && defined(slug.current)]{
      "slug": slug.current,
      _updatedAt
    }`),
    client.fetch(`*[_type == "page" && defined(slug.current)]{
      "slug": slug.current,
      _updatedAt
    }`),
  ])

  // Static pages
  const staticPages = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${siteUrl}/subscribe`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ]

  // Article pages
  const articlePages = articles.map((article: { slug: string; _updatedAt: string }) => ({
    url: `${siteUrl}/article/${article.slug}`,
    lastModified: new Date(article._updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }))

  // Category pages
  const categoryPages = categories.map((cat: { slug: string; _updatedAt: string }) => ({
    url: `${siteUrl}/${cat.slug}`,
    lastModified: new Date(cat._updatedAt),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }))

  // Author pages
  const authorPages = authors.map((author: { slug: string; _updatedAt: string }) => ({
    url: `${siteUrl}/author/${author.slug}`,
    lastModified: new Date(author._updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  // CMS pages
  const cmsPages = pages.map((page: { slug: string; _updatedAt: string }) => ({
    url: `${siteUrl}/${page.slug}`,
    lastModified: new Date(page._updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }))

  return [...staticPages, ...articlePages, ...categoryPages, ...authorPages, ...cmsPages]
}
