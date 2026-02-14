export const revalidate = 60

import Header from "@/components/header"
import Footer from "@/components/footer"
import NewsletterSection from "@/components/newsletter-section"
import { getSiteSettings, getPageBySlug } from "@/lib/queries"
import { PortableText } from "@portabletext/react"

export default async function AboutPage() {
  const [siteSettings, page] = await Promise.all([
    getSiteSettings(),
    getPageBySlug("about"),
  ])

  return (
    <div className="min-h-screen bg-background">
      <Header siteSettings={siteSettings} />

      {/* Page Hero */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="w-16 h-[3px] bg-foreground mb-8" />
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl tracking-tight mb-6">
            {page?.title || "About The Checkout"}
          </h1>
          {page?.excerpt && (
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl">
              {page.excerpt}
            </p>
          )}
        </div>
      </section>

      {/* Body Content */}
      <section className="border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          {page?.body ? (
            <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:tracking-tight prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-foreground prose-a:underline prose-a:underline-offset-4 prose-blockquote:article-blockquote prose-strong:text-foreground">
              <PortableText value={page.body} />
            </div>
          ) : (
            <div className="space-y-8">
              <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:tracking-tight prose-p:text-muted-foreground prose-p:leading-relaxed">
                <h2 className="font-serif text-3xl sm:text-4xl tracking-tight mb-6">
                  About The Checkout
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  The Checkout is the essential intelligence source for European
                  eCommerce. We deliver curated news, analysis, data, and
                  interviews to operators, founders, and executives building the
                  future of online commerce across Europe.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Every Monday morning, thousands of industry leaders open their
                  inbox to find the most important stories and insights from the
                  European eCommerce landscape -- distilled into a sharp,
                  five-minute read.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  No paywalls. No fluff. Just the intelligence you need to start
                  your week informed and ahead.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <NewsletterSection siteSettings={siteSettings} />

      <Footer siteSettings={siteSettings} />
    </div>
  )
}
