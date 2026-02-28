export const revalidate = 86400

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
      getArticlesByCategory("funding", 4),
      getArticlesByCategory("interviews", 5),
    ])

  const defaultHeadline = (
    <>
      The European consumer <em>brands worth watching</em> — and the{" "}
      <em>founders building them</em>
    </>
  )

  const siteUrl = siteSettings?.siteUrl || "https://thecheckout.media"
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteSettings?.title || "The Checkout",
    url: siteUrl,
    description: siteSettings?.metaDescription || siteSettings?.description || "Essential eCommerce intelligence for European operators.",
    ...(siteSettings?.logo && {
      logo: urlFor(siteSettings.logo).width(600).url(),
    }),
    ...(siteSettings?.socialLinks && {
      sameAs: [
        siteSettings.socialLinks.twitter,
        siteSettings.socialLinks.linkedin,
        siteSettings.socialLinks.instagram,
      ].filter(Boolean),
    }),
  }

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteSettings?.title || "The Checkout",
    url: siteUrl,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Header siteSettings={siteSettings} />

      <main>
        {/* ───────────────────────── HERO ───────────────────────── */}
        <section className="border-b border-border">
          <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12 pt-12 sm:pt-16 lg:pt-20 pb-20 sm:pb-28 lg:pb-36 text-center">
            {/* Kicker */}
            <p className="animate-fade-in-up text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-muted-foreground mb-6 sm:mb-8">
              {siteSettings?.heroKicker || "EUROPEAN MARKET INTELLIGENCE"}
            </p>

            {/* Headline */}
            <h1 className="animate-fade-in-up-delay-1 font-serif text-[2.5rem] sm:text-6xl lg:text-[5.5rem] font-normal tracking-[-0.02em] leading-[1.05] sm:leading-[1] mb-8 sm:mb-10 text-balance max-w-[900px] mx-auto">
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
            <p className="animate-fade-in-up-delay-2 text-base sm:text-lg text-muted-foreground leading-relaxed mb-10 max-w-[540px] mx-auto">
              {siteSettings?.heroSubtitle ||
                "A weekly briefing for the people building European commerce. Free, sharp, opinionated."}
            </p>

            {/* Email Form */}
            <div className="animate-fade-in-up-delay-3 max-w-md mx-auto">
              <form className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                <input
                  type="email"
                  placeholder="YOUR EMAIL"
                  required
                  className="flex-1 bg-background border border-border px-4 py-3.5 text-sm font-medium tracking-widest placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors duration-500"
                />
                <button
                  type="submit"
                  className="bg-foreground text-background px-8 py-3.5 font-bold text-sm tracking-widest btn-subscribe transition-all duration-300"
                >
                  SUBSCRIBE
                </button>
              </form>

              {/* Form Note */}
              <p className="text-[10px] tracking-[0.15em] text-muted-foreground mt-4">
                {siteSettings?.heroFormNote || `JOIN ${siteSettings?.subscriberCount || "5,000"}+ OPERATORS. FREE WEEKLY BRIEFING.`}
              </p>
            </div>

            {/* Trusted By */}
            {siteSettings?.trustedByCompanies &&
              siteSettings.trustedByCompanies.length > 0 && (
                <div className="mt-16 sm:mt-20">
                  <p className="text-[10px] font-bold tracking-[0.3em] text-muted-foreground mb-8">
                    TRUSTED BY
                  </p>
                  <div className="flex flex-wrap justify-center items-center gap-x-12 lg:gap-x-16 gap-y-6">
                    {siteSettings.trustedByCompanies.map(
                      (company: any, index: number) => (
                        <div key={index} className="opacity-40 hover:opacity-100 transition-opacity duration-500">
                          {company.logo ? (
                            <img
                              src={urlFor(company.logo).height(40).url()}
                              alt={company.name || "Company logo"}
                              className="h-8 lg:h-10 w-auto object-contain"
                            />
                          ) : (
                            <span className="font-serif text-xl lg:text-2xl text-muted-foreground">
                              {company.name}
                            </span>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
          </div>
        </section>

        {/* ───────────────────── FEATURED STORIES ───────────────────── */}
        {featuredArticles && featuredArticles.length > 0 && (
          <section className="border-b border-border bg-foreground text-background">
            <div className="max-w-[1200px] mx-auto">
            <div className="grid lg:grid-cols-[1fr_2fr]">
              {/* Left panel */}
              <div className="px-6 sm:px-8 lg:px-12 py-12 lg:py-16 flex flex-col justify-center lg:border-r border-background/10">
                <h2 className="font-serif text-5xl lg:text-6xl font-normal tracking-tight leading-[1.05]">
                  Featured<br />Stories
                </h2>
              </div>

              {/* Stories grid */}
              <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 divide-background/10">
                {featuredArticles.map((article: any, idx: number) => (
                  <Link
                    key={article._id}
                    href={`/article/${article.slug.current}`}
                    className={`px-6 sm:px-8 py-8 lg:py-10 group transition-colors duration-500 hover:bg-background/5${
                      idx % 2 === 1 ? " sm:border-l border-background/10" : ""
                    }${idx >= 2 ? " sm:border-t border-background/10" : ""}`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      {/* Tag */}
                      {article.categories?.[0] && (
                        <span
                          className={`text-[9px] font-bold px-2.5 py-1 tracking-[0.15em] ${
                            article.categories?.[0].title?.toUpperCase() === "BREAKING"
                              ? "bg-accent text-accent-foreground"
                              : "bg-background/10 text-background/70"
                          }`}
                        >
                          {article.categories?.[0].title?.toUpperCase()}
                        </span>
                      )}

                      {/* Time */}
                      <span className="text-[10px] text-background/40 font-medium tracking-wide">
                        {formatDate(article.publishedAt)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-xl lg:text-xl font-normal tracking-tight leading-snug text-background/90 group-hover:text-background transition-colors duration-500">
                      <span className="headline-hover-white">{article.title}</span>
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
          <section className="py-20 lg:py-28 border-b border-border">
            <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12">
              {/* Section heading */}
              <div className="flex items-baseline justify-between mb-16">
                <div className="flex items-baseline gap-4">
                  <h2 className="font-serif text-5xl lg:text-6xl font-normal tracking-tight">
                    News
                  </h2>
                  <div className="w-16 h-[2px] bg-foreground mb-2" />
                </div>
                <Link
                  href="/news"
                  className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors duration-500 group"
                >
                  VIEW ALL{" "}
                  <span className="inline-block group-hover:translate-x-1 transition-transform duration-500">
                    {"-->"}
                  </span>
                </Link>
              </div>

              {/* Featured first article */}
              {newsArticles[0] && (
                <Link
                  href={`/article/${newsArticles[0].slug.current}`}
                  className="block mb-16 lg:mb-20 group"
                >
                  <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-12">
                    {/* Image */}
                    {newsArticles[0].featuredImage && (
                      <div className="image-editorial w-full aspect-[16/10] bg-card">
                        <img
                          src={urlFor(newsArticles[0].featuredImage)
                            .width(1200)
                            .url()}
                          alt={newsArticles[0].title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex flex-col justify-center">
                      <p className="text-[10px] font-bold tracking-[0.2em] text-foreground mb-4">
                        {newsArticles[0].categories?.[0]?.title?.toUpperCase() || "NEWS"}
                      </p>
                      <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.1] tracking-tight mb-6">
                        <span className="headline-hover">
                          {newsArticles[0].title}
                        </span>
                      </h3>
                      {newsArticles[0].excerpt && (
                        <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-[540px]">
                          {newsArticles[0].excerpt}
                        </p>
                      )}
                      <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground group-hover:text-foreground transition-colors duration-500 mt-8">
                        READ STORY {"-->"}
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Divider */}
              <div className="border-t border-border mb-12" />

              {/* Remaining articles in 3-column grid */}
              {newsArticles.length > 1 && (
                <div className="grid lg:grid-cols-3 gap-x-12 gap-y-12">
                  {newsArticles.slice(1).map((article: any) => (
                    <Link
                      key={article._id}
                      href={`/article/${article.slug.current}`}
                      className="group card-lift block"
                    >
                      {/* Image */}
                      {article.featuredImage && (
                        <div className="image-editorial w-full aspect-[16/10] bg-card mb-5">
                          <img
                            src={urlFor(article.featuredImage)
                              .width(1200)
                              .url()}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Tag */}
                      <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground mb-4">
                        {article.categories?.[0]?.title?.toUpperCase() || "NEWS"}
                      </p>

                      {/* Title */}
                      <h3 className="font-serif text-xl lg:text-2xl font-normal leading-snug mb-3">
                        <span className="headline-hover">
                          {article.title}
                        </span>
                      </h3>

                      {/* Excerpt */}
                      {article.excerpt && (
                        <p className="text-sm text-muted-foreground leading-relaxed">
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
          <section className="py-20 lg:py-28 border-b border-border">
            <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12">
              {/* Section heading */}
              <div className="flex items-baseline justify-between mb-16">
                <div className="flex items-baseline gap-4">
                  <h2 className="font-serif text-5xl lg:text-6xl font-normal tracking-tight">
                    Analysis
                  </h2>
                  <div className="w-16 h-[2px] bg-foreground mb-2" />
                </div>
                <Link
                  href="/analysis"
                  className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors duration-500 group"
                >
                  VIEW ALL{" "}
                  <span className="inline-block group-hover:translate-x-1 transition-transform duration-500">
                    {"-->"}
                  </span>
                </Link>
              </div>

              {/* Featured first article — side-by-side card */}
              {analysisArticles[0] && (
                <Link
                  href={`/article/${analysisArticles[0].slug.current}`}
                  className="block mb-12 group"
                >
                  <div className="bg-card border border-border p-8 lg:p-12">
                    <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12">
                      {/* Content */}
                      <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-[10px] font-bold tracking-[0.2em] text-foreground">
                            DEEP DIVE
                          </span>
                          <span className="text-[10px] text-muted-foreground/50">|</span>
                          <span className="text-[10px] text-muted-foreground/50">
                            {formatDate(analysisArticles[0].publishedAt)}
                          </span>
                          {analysisArticles[0].readingTime && (
                            <>
                              <span className="text-[10px] text-muted-foreground/50">|</span>
                              <span className="text-[10px] text-muted-foreground/50">
                                {analysisArticles[0].readingTime} MIN READ
                              </span>
                            </>
                          )}
                        </div>
                        <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.1] tracking-tight mb-6">
                          <span className="headline-hover">
                            {analysisArticles[0].title}
                          </span>
                        </h3>
                        {analysisArticles[0].excerpt && (
                          <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                            {analysisArticles[0].excerpt}
                          </p>
                        )}
                        <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground group-hover:text-foreground transition-colors duration-500 mt-8 inline-block">
                          READ ANALYSIS {"-->"}
                        </span>
                      </div>

                      {/* Image */}
                      {analysisArticles[0].featuredImage && (
                        <div className="image-editorial w-full aspect-[4/3] bg-card overflow-hidden order-first lg:order-last">
                          <img
                            src={urlFor(analysisArticles[0].featuredImage)
                              .width(1200)
                              .url()}
                            alt={analysisArticles[0].title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              )}

              {/* Divider */}
              <div className="border-t border-border mb-12 mt-12" />

              {/* Remaining articles in 3-column grid */}
              {analysisArticles.length > 1 && (
                <div className="grid lg:grid-cols-3 gap-x-12 gap-y-12">
                  {analysisArticles.slice(1).map((article: any) => (
                    <Link
                      key={article._id}
                      href={`/article/${article.slug.current}`}
                      className="group card-lift block"
                    >
                      {/* Image */}
                      {article.featuredImage && (
                        <div className="image-editorial w-full aspect-[16/10] bg-card mb-5">
                          <img
                            src={urlFor(article.featuredImage)
                              .width(1200)
                              .url()}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Tag */}
                      <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground mb-4">
                        ANALYSIS
                      </p>

                      {/* Title */}
                      <h3 className="font-serif text-xl lg:text-2xl font-normal leading-snug mb-3">
                        <span className="headline-hover">
                          {article.title}
                        </span>
                      </h3>

                      {/* Excerpt */}
                      {article.excerpt && (
                        <p className="text-sm text-muted-foreground leading-relaxed">
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

        {/* ───────────────────────── DEAL FLOW ───────────────────────── */}
        {dataArticles && dataArticles.length > 0 && (
          <section className="py-20 lg:py-28 border-b border-border">
            <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12">
              {/* Section heading */}
              <div className="flex items-baseline justify-between mb-16">
                <div className="flex items-baseline gap-4">
                  <h2 className="font-serif text-5xl lg:text-6xl font-normal tracking-tight">
                    Deal Flow
                  </h2>
                  <div className="w-16 h-[2px] bg-foreground mb-2" />
                </div>
                <Link
                  href="/funding"
                  className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors duration-500 group"
                >
                  VIEW ALL{" "}
                  <span className="inline-block group-hover:translate-x-1 transition-transform duration-500">
                    {"-->"}
                  </span>
                </Link>
              </div>

              {/* Articles — horizontal rows with thumbnails */}
              <div className="divide-y divide-border">
                {dataArticles.map((article: any) => (
                  <Link
                    key={article._id}
                    href={`/article/${article.slug.current}`}
                    className="group card-lift flex gap-6 lg:gap-8 py-8"
                  >
                    {/* Thumbnail */}
                    {article.featuredImage && (
                      <div className="image-editorial w-28 h-28 lg:w-40 lg:h-28 shrink-0 bg-card">
                        <img
                          src={urlFor(article.featuredImage)
                            .width(480)
                            .url()}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex flex-col justify-center min-w-0">
                      <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground mb-2">
                        DEAL FLOW
                      </p>

                      <h3 className="font-serif text-xl lg:text-2xl font-normal leading-snug mb-2">
                        <span className="headline-hover">
                          {article.title}
                        </span>
                      </h3>

                      {article.excerpt && (
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 hidden sm:block">
                          {article.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ───────────────────────── INTERVIEWS ───────────────────────── */}
        {interviewArticles && interviewArticles.length > 0 && (
          <section className="py-20 lg:py-28 border-b border-border">
            <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12">
              {/* Section heading */}
              <div className="flex items-baseline justify-between mb-16">
                <div className="flex items-baseline gap-4">
                  <h2 className="font-serif text-5xl lg:text-6xl font-normal tracking-tight">
                    Interviews
                  </h2>
                  <div className="w-16 h-[2px] bg-foreground mb-2" />
                </div>
                <Link
                  href="/interviews"
                  className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors duration-500 group"
                >
                  VIEW ALL{" "}
                  <span className="inline-block group-hover:translate-x-1 transition-transform duration-500">
                    {"-->"}
                  </span>
                </Link>
              </div>

              {/* Featured interview */}
              {interviewArticles[0] && (
                <Link
                  href={`/article/${interviewArticles[0].slug.current}`}
                  className="block mb-12 group"
                >
                  <div className="grid lg:grid-cols-[320px_1fr] gap-8 lg:gap-12">
                    {/* Photo */}
                    {interviewArticles[0].featuredImage && (
                      <div className="image-editorial w-full aspect-[4/5] bg-card">
                        <img
                          src={urlFor(interviewArticles[0].featuredImage)
                            .width(1200)
                            .url()}
                          alt={interviewArticles[0].title}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex flex-col justify-center">
                      <p className="text-[10px] font-bold tracking-[0.2em] text-foreground mb-4">
                        INTERVIEW
                      </p>

                      <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.1] tracking-tight mb-5">
                        <span className="headline-hover">
                          {interviewArticles[0].title}
                        </span>
                      </h3>

                      {interviewArticles[0].excerpt && (
                        <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-[540px] mb-6">
                          {interviewArticles[0].excerpt}
                        </p>
                      )}

                    </div>
                  </div>
                </Link>
              )}

              {/* Divider */}
              <div className="border-t border-border mb-0" />

              {/* Remaining interviews */}
              {interviewArticles.length > 1 && (
                <div className="grid lg:grid-cols-2 gap-x-12">
                  {interviewArticles.slice(1).map((article: any) => (
                    <Link
                      key={article._id}
                      href={`/article/${article.slug.current}`}
                      className="group card-lift flex gap-6 py-8 border-b border-border"
                    >
                      {/* Small photo */}
                      {article.featuredImage && (
                        <div className="image-editorial w-20 h-20 lg:w-24 lg:h-24 shrink-0 bg-card">
                          <img
                            src={urlFor(article.featuredImage)
                              .width(480)
                              .url()}
                            alt={article.title}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex flex-col justify-center min-w-0">
                        <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground mb-2">
                          INTERVIEW
                        </p>

                        <h3 className="font-serif text-xl lg:text-2xl font-normal leading-snug mb-2">
                          <span className="headline-hover">
                            {article.title}
                          </span>
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
