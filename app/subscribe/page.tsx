export const revalidate = 86400

import Header from "@/components/header"
import Footer from "@/components/footer"
import { getSiteSettings } from "@/lib/queries"
import { urlFor } from "@/lib/sanity"

export default async function SubscribePage() {
  const siteSettings = await getSiteSettings()

  return (
    <div className="min-h-screen bg-background">
      <Header siteSettings={siteSettings} />

      {/* Subscribe Section */}
      <section>
        <div className="max-w-[780px] mx-auto px-6 sm:px-8 py-20 sm:py-28 lg:py-36">
          {/* Kicker */}
          <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-muted-foreground mb-6 sm:mb-8">
            {siteSettings?.subscribePageKicker || "FREE WEEKLY NEWSLETTER"}
          </p>

          {/* Headline */}
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-[4.5rem] font-normal tracking-[-0.02em] leading-[1.05] mb-8 sm:mb-10">
            {siteSettings?.subscribePageHeadline ||
              "The briefing European operators trust"}
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-12 max-w-[600px]">
            {siteSettings?.subscribePageSubtitle ||
              `Every week, ${siteSettings?.subscriberCount || "5,000"}+ founders, investors, and executives start their week with The Checkout. Join them.`}
          </p>

          {/* Email Form */}
          <form className="flex flex-col sm:flex-row gap-3 sm:gap-0 max-w-[640px] mb-5">
            <input
              type="email"
              placeholder="NAME@EMAIL.COM"
              required
              className="flex-1 bg-card border border-border px-5 py-4 text-sm font-medium tracking-widest placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors duration-500"
            />
            <button
              type="submit"
              className="bg-foreground text-background px-8 py-4 font-bold text-sm tracking-widest hover:bg-foreground/90 transition-all duration-500 shrink-0"
            >
              SUBSCRIBE FREE
            </button>
          </form>

          {/* Form Note */}
          <p className="text-sm text-muted-foreground">
            {siteSettings?.subscribePageFormNote ||
              "No spam. Unsubscribe anytime. We respect your inbox."}
          </p>
        </div>
      </section>

      {/* Trusted By */}
      {siteSettings?.trustedByCompanies &&
        siteSettings.trustedByCompanies.length > 0 && (
          <section className="border-t border-border">
            <div className="max-w-[780px] mx-auto px-6 sm:px-8 py-16 sm:py-20 text-center">
              <p className="text-[10px] font-bold tracking-[0.3em] text-muted-foreground mb-10">
                TRUSTED BY LEADING COMPANIES AND FOUNDERS
              </p>
              <div className="flex flex-wrap justify-center items-center gap-x-12 lg:gap-x-16 gap-y-6">
                {siteSettings.trustedByCompanies.map(
                  (company: any, index: number) => (
                    <div
                      key={index}
                      className="opacity-30"
                    >
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
          </section>
        )}

      <Footer siteSettings={siteSettings} />
    </div>
  )
}
