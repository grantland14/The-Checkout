export const revalidate = 60

import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import NewsletterSection from "@/components/newsletter-section"
import { urlFor } from "@/lib/sanity"
import {
  getSiteSettings,
  getFeaturedArticles,
  getArticlesByCategory,
} from "@/lib/queries"

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

export default async function HomePage() {
  const [siteSettings, featuredArticles, newsArticles, analysisArticles, dataArticles, interviewArticles] =
    await Promise.all([
      getSiteSettings(),
      getFeaturedArticles(4),
      getArticlesByCategory("news", 7),
      getArticlesByCategory("analysis", 5),
      getArticlesByCategory("data", 4),
      getArticlesByCategory("interviews", 5),
    ])

  const defaultHeadline = (
    <>
      The European consumer <em>brands worth watching</em> — and the{" "}
      <em>founders building them</em>
    </>
  )

  return (
    <>
      <Header siteSettings={siteSettings} />

      <main>
        {/* ───────────────────────── HERO ───────────────────────── */}
        <section className="border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 text-center">
            {/* Kicker */}
            <p className="text-[10px] font-bold tracking-[0.25em] text-muted-foreground mb-6 animate-fade-in-up">
              {siteSettings?.heroKicker || "EUROPEAN MARKET INTELLIGENCE"}
            </p>

            {/* Headline */}
            <h1 className="font-serif text-[2.5rem] sm:text-6xl lg:text-[5.5rem] tracking-tight leading-[1.05] max-w-5xl mx-auto mb-6 animate-fade-in-up-delay-1">
              {siteSettings?.heroHeadline ? (
                <span
                  dangerouslySetInnerHTML={{
                    __html: siteSettings.heroHeadline,
                  }}
                />
              ) : (
                defaultHeadline
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up-delay-2">
              {siteSettings?.heroSubtitle ||
                "A weekly briefing for the people building European commerce. Free, sharp, opinionated."}
            </p>

            {/* Email Form */}
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6 animate-fade-in-up-delay-3">
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 bg-background border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              />
              <button
                type="submit"
                className="bg-foreground text-background px-6 py-3 font-bold text-[10px] tracking-[0.2em] hover:bg-foreground/90 transition shrink-0"
              >
                SUBSCRIBE
              </button>
            </form>

            {/* Form Note */}
            <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground mb-16">
              JOIN {siteSettings?.subscriberCount || "5,000"}+ OPERATORS. FREE
              WEEKLY BRIEFING.
            </p>

            {/* Trusted By */}
            {siteSettings?.trustedByCompanies &&
              siteSettings.trustedByCompanies.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground mb-4">
                    TRUSTED BY
                  </p>
                  <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
                    {siteSettings.trustedByCompanies.map(
                      (company: string, index: number) => (
                        <span
                          key={index}
                          className="font-serif text-xl text-muted-foreground/40 hover:text-foreground transition cursor-default"
                        >
                          {company}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}
          </div>
        </section>

        {/* ───────────────────── FEATURED STORIES ───────────────────── */}
        {featuredArticles && featuredArticles.length > 0 && (
          <section className="bg-foreground text-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                {/* Left: Section header */}
                <div>
                  <p className="text-[10px] font-bold tracking-[0.25em] text-background/50 mb-4">
                    RIGHT NOW
                  </p>
                  <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl tracking-tight">
                    Featured Stories
                  </h2>
                </div>

                {/* Right: 2x2 grid */}
                <div className="grid sm:grid-cols-2 gap-px bg-background/10">
                  {featuredArticles.map((article: any) => (
                    <Link
                      key={article._id}
                      href={`/article/${article.slug.current}`}
                      className="group p-6 hover:bg-background/5 transition"
                    >
                      {/* Category badge */}
                      {article.category && (
                        <span className="inline-block text-[9px] font-bold px-2.5 py-1 tracking-[0.15em] bg-background/10 text-background/70 mb-3">
                          {article.category.title?.toUpperCase()}
                        </span>
                      )}

                      {/* Date */}
                      <p className="text-[11px] text-background/40 mb-2">
                        {formatDate(article.publishedAt)}
                      </p>

                      {/* Title */}
                      <h3 className="font-serif text-xl leading-snug headline-hover">
                        {article.title}
                      </h3>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ───────────────────────── NEWS ───────────────────────── */}
        {newsArticles && newsArticles.length > 0 && (
          <section className="border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
              {/* Section heading */}
              <div className="flex items-center gap-4 mb-12">
                <h2 className="font-serif text-4xl sm:text-5xl tracking-tight">
                  News
                </h2>
                <div className="flex-1 h-px bg-border" />
                <Link
                  href="/news"
                  className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground hover:text-foreground transition shrink-0"
                >
                  VIEW ALL --&gt;
                </Link>
              </div>

              {/* Featured first article */}
              {newsArticles[0] && (
                <Link
                  href={`/article/${newsArticles[0].slug.current}`}
                  className="group grid md:grid-cols-2 gap-8 mb-16 card-lift"
                >
                  {/* Image */}
                  {newsArticles[0].featuredImage && (
                    <div className="image-editorial aspect-[16/10] bg-muted overflow-hidden">
                      <img
                        src={urlFor(newsArticles[0].featuredImage)
                          .width(800)
                          .height(500)
                          .url()}
                        alt={newsArticles[0].title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex flex-col justify-center">
                    <p className="text-[10px] font-bold tracking-[0.25em] text-muted-foreground mb-3">
                      LATEST
                    </p>
                    <h3 className="font-serif text-3xl sm:text-4xl tracking-tight leading-snug mb-4 headline-hover">
                      {newsArticles[0].title}
                    </h3>
                    {newsArticles[0].excerpt && (
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {newsArticles[0].excerpt}
                      </p>
                    )}
                    <span className="text-[10px] font-bold tracking-[0.2em]">
                      READ STORY --&gt;
                    </span>
                  </div>
                </Link>
              )}

              {/* Remaining articles in 3-column grid */}
              {newsArticles.length > 1 && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {newsArticles.slice(1).map((article: any) => (
                    <Link
                      key={article._id}
                      href={`/article/${article.slug.current}`}
                      className="group card-lift"
                    >
                      {/* Image */}
                      {article.featuredImage && (
                        <div className="image-editorial aspect-[16/10] bg-muted overflow-hidden mb-4">
                          <img
                            src={urlFor(article.featuredImage)
                              .width(600)
                              .height(375)
                              .url()}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Category badge */}
                      {article.category && (
                        <span className="inline-block text-[9px] font-bold px-2.5 py-1 tracking-[0.15em] border border-border text-muted-foreground mb-3">
                          {article.category.title?.toUpperCase()}
                        </span>
                      )}

                      {/* Date */}
                      <p className="text-[11px] text-muted-foreground mb-2">
                        {formatDate(article.publishedAt)}
                      </p>

                      {/* Title */}
                      <h3 className="font-serif text-xl leading-snug mb-2 headline-hover">
                        {article.title}
                      </h3>

                      {/* Excerpt */}
                      {article.excerpt && (
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                          {article.excerpt}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ───────────────────────── ANALYSIS ───────────────────────── */}
        {analysisArticles && analysisArticles.length > 0 && (
          <section className="border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
              {/* Section heading */}
              <div className="flex items-center gap-4 mb-12">
                <h2 className="font-serif text-4xl sm:text-5xl tracking-tight">
                  Analysis
                </h2>
                <div className="flex-1 h-px bg-border" />
                <Link
                  href="/analysis"
                  className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground hover:text-foreground transition shrink-0"
                >
                  VIEW ALL --&gt;
                </Link>
              </div>

              {/* Featured first article */}
              {analysisArticles[0] && (
                <Link
                  href={`/article/${analysisArticles[0].slug.current}`}
                  className="group block mb-16 card-lift"
                >
                  <p className="text-[10px] font-bold tracking-[0.25em] text-muted-foreground mb-3">
                    DEEP DIVE
                  </p>
                  <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-snug mb-4 headline-hover max-w-3xl">
                    {analysisArticles[0].title}
                  </h3>
                  {analysisArticles[0].excerpt && (
                    <p className="text-lg text-muted-foreground mb-4 max-w-2xl leading-relaxed">
                      {analysisArticles[0].excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-4">
                    {analysisArticles[0].readingTime && (
                      <span className="text-[11px] text-muted-foreground">
                        {analysisArticles[0].readingTime} MIN READ
                      </span>
                    )}
                    <span className="text-[10px] font-bold tracking-[0.2em]">
                      READ ANALYSIS --&gt;
                    </span>
                  </div>
                </Link>
              )}

              {/* Remaining articles in 2-column grid */}
              {analysisArticles.length > 1 && (
                <div className="grid sm:grid-cols-2 gap-8">
                  {analysisArticles.slice(1).map((article: any) => (
                    <Link
                      key={article._id}
                      href={`/article/${article.slug.current}`}
                      className="group card-lift border-t border-border pt-6"
                    >
                      <span className="inline-block text-[9px] font-bold px-2.5 py-1 tracking-[0.15em] border border-border text-muted-foreground mb-3">
                        ANALYSIS
                      </span>

                      <p className="text-[11px] text-muted-foreground mb-2">
                        {formatDate(article.publishedAt)}
                      </p>

                      <h3 className="font-serif text-xl leading-snug mb-2 headline-hover">
                        {article.title}
                      </h3>

                      {article.excerpt && (
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                          {article.excerpt}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ───────────────────────── DATA ───────────────────────── */}
        {dataArticles && dataArticles.length > 0 && (
          <section className="border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
              {/* Section heading */}
              <div className="flex items-center gap-4 mb-12">
                <h2 className="font-serif text-4xl sm:text-5xl tracking-tight">
                  Data
                </h2>
                <div className="flex-1 h-px bg-border" />
                <Link
                  href="/data"
                  className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground hover:text-foreground transition shrink-0"
                >
                  VIEW ALL --&gt;
                </Link>
              </div>

              {/* List layout */}
              <div className="divide-y divide-border">
                {dataArticles.map((article: any) => (
                  <Link
                    key={article._id}
                    href={`/article/${article.slug.current}`}
                    className="group flex items-center justify-between py-6 card-lift"
                  >
                    <div className="flex items-center gap-6 min-w-0">
                      {/* Tag */}
                      <span className="hidden sm:inline-block text-[9px] font-bold px-2.5 py-1 tracking-[0.15em] border border-border text-muted-foreground shrink-0">
                        DATA
                      </span>

                      {/* Date */}
                      <span className="text-[11px] text-muted-foreground shrink-0">
                        {formatDate(article.publishedAt)}
                      </span>

                      {/* Title */}
                      <h3 className="font-serif text-lg sm:text-xl leading-snug headline-hover truncate">
                        {article.title}
                      </h3>
                    </div>

                    {/* Arrow */}
                    <span className="text-muted-foreground group-hover:text-foreground transition ml-4 shrink-0">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ───────────────────────── INTERVIEWS ───────────────────────── */}
        {interviewArticles && interviewArticles.length > 0 && (
          <section className="border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
              {/* Section heading */}
              <div className="flex items-center gap-4 mb-12">
                <h2 className="font-serif text-4xl sm:text-5xl tracking-tight">
                  Interviews
                </h2>
                <div className="flex-1 h-px bg-border" />
                <Link
                  href="/interviews"
                  className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground hover:text-foreground transition shrink-0"
                >
                  VIEW ALL --&gt;
                </Link>
              </div>

              {/* Featured interview */}
              {interviewArticles[0] && (
                <Link
                  href={`/article/${interviewArticles[0].slug.current}`}
                  className="group grid md:grid-cols-2 gap-8 mb-16 card-lift"
                >
                  {/* Photo */}
                  {interviewArticles[0].featuredImage && (
                    <div className="image-editorial aspect-[4/5] sm:aspect-[3/4] bg-muted overflow-hidden">
                      <img
                        src={urlFor(interviewArticles[0].featuredImage)
                          .width(600)
                          .height(800)
                          .url()}
                        alt={interviewArticles[0].title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex flex-col justify-center">
                    <span className="inline-block text-[9px] font-bold px-2.5 py-1 tracking-[0.15em] border border-border text-muted-foreground mb-3 self-start">
                      INTERVIEW
                    </span>

                    <p className="text-[11px] text-muted-foreground mb-3">
                      {formatDate(interviewArticles[0].publishedAt)}
                    </p>

                    <h3 className="font-serif text-3xl sm:text-4xl tracking-tight leading-snug mb-4 headline-hover">
                      {interviewArticles[0].title}
                    </h3>

                    {interviewArticles[0].excerpt && (
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {interviewArticles[0].excerpt}
                      </p>
                    )}

                    <span className="text-[10px] font-bold tracking-[0.2em]">
                      READ INTERVIEW --&gt;
                    </span>
                  </div>
                </Link>
              )}

              {/* Remaining interviews in 2-column grid */}
              {interviewArticles.length > 1 && (
                <div className="grid sm:grid-cols-2 gap-8">
                  {interviewArticles.slice(1).map((article: any) => (
                    <Link
                      key={article._id}
                      href={`/article/${article.slug.current}`}
                      className="group flex gap-5 card-lift"
                    >
                      {/* Small photo */}
                      {article.featuredImage && (
                        <div className="image-editorial w-24 h-24 sm:w-28 sm:h-28 bg-muted overflow-hidden shrink-0">
                          <img
                            src={urlFor(article.featuredImage)
                              .width(200)
                              .height(200)
                              .url()}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex flex-col justify-center min-w-0">
                        <span className="inline-block text-[9px] font-bold px-2.5 py-1 tracking-[0.15em] border border-border text-muted-foreground mb-2 self-start">
                          INTERVIEW
                        </span>

                        <p className="text-[11px] text-muted-foreground mb-1">
                          {formatDate(article.publishedAt)}
                        </p>

                        <h3 className="font-serif text-lg leading-snug headline-hover">
                          {article.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ───────────────────── NEWSLETTER CTA ───────────────────── */}
        <NewsletterSection siteSettings={siteSettings} />
      </main>

      <Footer siteSettings={siteSettings} />
    </>
  )
}
