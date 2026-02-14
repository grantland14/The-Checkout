import { urlFor } from "@/lib/sanity"

export default function NewsletterSection({
  siteSettings,
}: {
  siteSettings: any
}) {
  return (
    <section className="bg-card border-b border-border relative overflow-hidden">
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-foreground" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Kicker */}
        <p className="text-[10px] font-bold tracking-[0.25em] text-muted-foreground mb-4">
          THE BRIEFING
        </p>

        {/* Headline */}
        <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl tracking-tight mb-6">
          {siteSettings?.title || "The Checkout"}
        </h2>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-10">
          A weekly briefing for the people building European commerce. Free,
          sharp, opinionated.
        </p>

        {/* Email Form */}
        <form className="flex flex-col sm:flex-row gap-3 max-w-lg mb-8">
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

        {/* Stats */}
        <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground mb-12">
          {siteSettings?.subscriberCount && (
            <span>{siteSettings.subscriberCount} READERS</span>
          )}
          {siteSettings?.subscriberCount && siteSettings?.openRate && (
            <span> | </span>
          )}
          {siteSettings?.openRate && (
            <span>{siteSettings.openRate} OPEN RATE</span>
          )}
        </p>

        {/* Trusted By */}
        {siteSettings?.trustedByCompanies &&
          siteSettings.trustedByCompanies.length > 0 && (
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground mb-4">
                TRUSTED BY LEADING COMPANIES AND FOUNDERS
              </p>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                {siteSettings.trustedByCompanies.map(
                  (company: any, index: number) => (
                    <div key={index} className="opacity-50">
                      {company.logo ? (
                        <img
                          src={urlFor(company.logo).height(32).url()}
                          alt={company.name || "Company logo"}
                          className="h-6 sm:h-8 w-auto object-contain"
                        />
                      ) : (
                        <span className="font-serif text-lg sm:text-xl text-muted-foreground">
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
  )
}
