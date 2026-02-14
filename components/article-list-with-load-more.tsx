"use client"

import { useState } from "react"
import Link from "next/link"
import { urlFor } from "@/lib/sanity"

type Article = {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  publishedAt: string
  featuredImage?: any
  category?: { title: string; slug: { current: string } }
}

export default function ArticleListWithLoadMore({
  articles,
  initialCount = 8,
}: {
  articles: Article[]
  initialCount?: number
}) {
  const [visibleCount, setVisibleCount] = useState(initialCount)
  const visibleArticles = articles.slice(0, visibleCount)
  const hasMore = visibleCount < articles.length

  return (
    <>
      <div className="divide-y divide-border">
        {visibleArticles.map((article) => (
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
        ))}
      </div>

      {hasMore && (
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12 py-10">
          <button
            onClick={() => setVisibleCount((prev) => prev + 8)}
            className="w-full py-4 border border-border text-[10px] font-bold tracking-[0.2em] text-muted-foreground hover:text-foreground hover:border-foreground transition-all duration-500"
          >
            LOAD MORE
          </button>
        </div>
      )}
    </>
  )
}
