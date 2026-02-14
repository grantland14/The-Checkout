import { client } from './sanity'

// ---------- Site Settings ----------
export async function getSiteSettings() {
  return client.fetch(`*[_type == "siteSettings"][0]{
    title,
    description,
    logo,
    logoLight,
    heroHeadline,
    heroSubtitle,
    heroKicker,
    subscriberCount,
    heroFormNote,
    openRate,
    trustedByCompanies,
    newsletterKicker,
    newsletterSubtitle,
    socialLinks,
    footerTagline,
    subscribePageKicker,
    subscribePageHeadline,
    subscribePageSubtitle,
    subscribePageFormNote,
    navigation,
    secondaryNavigation,
    veniceCta
  }`)
}

// ---------- Articles ----------
export async function getFeaturedArticles(limit = 4) {
  return client.fetch(`*[_type == "article" && featured == true] | order(publishedAt desc)[0...$limit]{
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    featured,
    featuredImage,
    category->{title, slug},
    author->{name, slug, role, photo},
    "readingTime": round(length(pt::text(body)) / 5 / 200)
  }`, { limit })
}

export async function getArticlesByCategory(categorySlug: string, limit = 7) {
  return client.fetch(`*[_type == "article" && category->slug.current == $categorySlug] | order(publishedAt desc)[0...$limit]{
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    featured,
    sponsored,
    sponsorName,
    featuredImage,
    category->{title, slug},
    author->{name, slug, role, photo},
    "readingTime": round(length(pt::text(body)) / 5 / 200)
  }`, { categorySlug, limit })
}

export async function getArticleBySlug(slug: string) {
  return client.fetch(`*[_type == "article" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    excerpt,
    body,
    publishedAt,
    featured,
    sponsored,
    sponsorName,
    featuredImage,
    category->{title, slug},
    author->{name, slug, role, photo, bio},
    brandsMentioned[]->{_id, name, slug, logo, category},
    relatedArticles[]->{
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      featuredImage,
      category->{title, slug}
    },
    "readingTime": round(length(pt::text(body)) / 5 / 200)
  }`, { slug })
}

export async function getAllArticleSlugs() {
  return client.fetch(`*[_type == "article" && defined(slug.current)]{
    "slug": slug.current
  }`)
}

export async function getLatestArticles(limit = 12, excludeId?: string) {
  const filter = excludeId
    ? `*[_type == "article" && _id != $excludeId]`
    : `*[_type == "article"]`
  return client.fetch(`${filter} | order(publishedAt desc)[0...$limit]{
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    featured,
    featuredImage,
    category->{title, slug},
    author->{name, slug, role, photo},
    "readingTime": round(length(pt::text(body)) / 5 / 200)
  }`, { limit, excludeId })
}

// ---------- Categories ----------
export async function getAllCategories() {
  return client.fetch(`*[_type == "category"] | order(title asc){
    _id,
    title,
    slug,
    description
  }`)
}

export async function getCategoryBySlug(slug: string) {
  return client.fetch(`*[_type == "category" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    description
  }`, { slug })
}

// ---------- Brands ----------
export async function getAllBrands() {
  return client.fetch(`*[_type == "brand"] | order(name asc){
    _id,
    name,
    slug,
    logo,
    featuredImage,
    website,
    tagline,
    category,
    headquarters,
    featured
  }`)
}

export async function getBrandBySlug(slug: string) {
  return client.fetch(`*[_type == "brand" && slug.current == $slug][0]{
    _id,
    name,
    slug,
    logo,
    featuredImage,
    website,
    tagline,
    about,
    category,
    headquarters,
    foundedYear,
    founders,
    fundingStage,
    totalFunding,
    employeeCount,
    socialLinks,
    featured,
    "articles": *[_type == "article" && references(^._id)] | order(publishedAt desc){
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      featuredImage,
      category->{title, slug}
    }
  }`, { slug })
}

// ---------- Authors ----------
export async function getAllAuthorSlugs() {
  return client.fetch(`*[_type == "author" && defined(slug.current)]{
    "slug": slug.current
  }`)
}

export async function getAuthorBySlug(slug: string) {
  return client.fetch(`*[_type == "author" && slug.current == $slug][0]{
    _id,
    name,
    slug,
    role,
    photo,
    bio,
    twitter,
    linkedin,
    "articles": *[_type == "article" && author._ref == ^._id] | order(publishedAt desc){
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      featuredImage,
      category->{title, slug}
    }
  }`, { slug })
}

// ---------- Pages ----------
export async function getPageBySlug(slug: string) {
  return client.fetch(`*[_type == "page" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    excerpt,
    body,
    featuredImage,
    seo
  }`, { slug })
}
