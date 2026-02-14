import Header from "@/components/header"
import Footer from "@/components/footer"
import { getSiteSettings } from "@/lib/queries"

export default async function SubscribePage() {
  const siteSettings = await getSiteSettings()

  const subscriberCount = siteSettings?.subscriberCount || "5,000"

  return (
    <div className="min-h-screen bg-background">
      <Header siteSettings={siteSettings} />

      {/* Subscribe Hero */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Column */}
            <div>
              <p className="text-[10px] font-bold tracking-[0.25em] text-muted-foreground mb-6">
                FREE WEEKLY NEWSLETTER
              </p>
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl tracking-tight mb-6">
                {siteSettings?.title || "The Checkout"}
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-lg mb-10">
                The essential briefing for European eCommerce operators,
                founders, and executives.
              </p>

              {/* Email Form */}
              <form className="flex flex-col sm:flex-row gap-3 max-w-lg mb-4">
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
                  SUBSCRIBE FREE
                </button>
              </form>
              <p className="text-xs text-muted-foreground">
                No spam. Unsubscribe anytime. We respect your inbox.
              </p>
            </div>

            {/* Right Column - Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card border border-border p-8">
                <span className="font-serif text-3xl tracking-tight block mb-2">
                  {subscriberCount}+
                </span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground block mb-1">
                  SUBSCRIBERS
                </span>
                <span className="text-sm text-muted-foreground">
                  Weekly readers
                </span>
              </div>
              <div className="bg-card border border-border p-8">
                <span className="font-serif text-3xl tracking-tight block mb-2">
                  FREE
                </span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground block mb-1">
                  ALWAYS
                </span>
                <span className="text-sm text-muted-foreground">
                  No paywalls, no gimmicks
                </span>
              </div>
              <div className="bg-card border border-border p-8">
                <span className="font-serif text-3xl tracking-tight block mb-2">
                  8AM
                </span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground block mb-1">
                  DELIVERY
                </span>
                <span className="text-sm text-muted-foreground">
                  Monday mornings every week
                </span>
              </div>
              <div className="bg-card border border-border p-8">
                <span className="font-serif text-3xl tracking-tight block mb-2">
                  5 min
                </span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground block mb-1">
                  READ TIME
                </span>
                <span className="text-sm text-muted-foreground">
                  Quick, actionable briefing
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dark CTA Section */}
      <section className="bg-foreground text-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6">
            Start your week informed
          </h2>
          <p className="text-lg sm:text-xl text-background/60 mb-10 max-w-xl mx-auto">
            Join thousands of European eCommerce leaders who start their Monday
            with The Checkout.
          </p>

          {/* Email Form (Light on Dark) */}
          <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 bg-background/10 border border-background/20 text-background text-sm placeholder:text-background/40 focus:outline-none focus:ring-1 focus:ring-background"
            />
            <button
              type="submit"
              className="bg-background text-foreground px-6 py-3 font-bold text-[10px] tracking-[0.2em] hover:bg-background/90 transition shrink-0"
            >
              SUBSCRIBE FREE
            </button>
          </form>
        </div>
      </section>

      <Footer siteSettings={siteSettings} />
    </div>
  )
}
