import Link from "next/link"

export default function Footer({ siteSettings }: { siteSettings: any }) {
  const title = siteSettings?.title || "The Checkout"
  const footerCta = siteSettings?.footerCta
  const socialLinks = siteSettings?.socialLinks

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12 pt-16 sm:pt-24 pb-12 sm:pb-16">
        {/* Top: Branding + Email */}
        <div className="grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 pb-14 sm:pb-16 border-b border-background/10">
          {/* Left: Brand */}
          <div>
            <h2 className="font-serif text-4xl sm:text-5xl tracking-tight text-background mb-4">
              {title}
            </h2>
            {siteSettings?.footerTagline && (
              <p className="text-sm text-background/40 max-w-sm leading-relaxed">
                {siteSettings.footerTagline}
              </p>
            )}
          </div>

          {/* Right: Email capture */}
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-background/50 mb-4">
              {siteSettings?.newsletterKicker || "SUBSCRIBE"}
            </p>
            <form className="flex flex-col sm:flex-row gap-3 mb-4">
              <input
                type="email"
                placeholder="NAME@EMAIL.COM"
                required
                className="flex-1 bg-transparent border border-background/20 px-5 py-3.5 text-sm font-medium tracking-widest text-background placeholder:text-background/30 focus:outline-none focus:border-background/50 transition-colors duration-500"
              />
              <button
                type="submit"
                className="bg-background text-foreground px-7 py-3.5 font-bold text-[10px] tracking-[0.2em] hover:bg-background/90 transition-colors duration-300 shrink-0"
              >
                SUBSCRIBE
              </button>
            </form>
            <p className="text-[10px] tracking-[0.15em] text-background/30">
              {siteSettings?.subscriberCount && (
                <span>{siteSettings.subscriberCount} READERS</span>
              )}
              {siteSettings?.subscriberCount && siteSettings?.openRate && (
                <span> &middot; </span>
              )}
              {siteSettings?.openRate && (
                <span>{siteSettings.openRate} OPEN RATE</span>
              )}
            </p>
          </div>
        </div>

        {/* Middle: Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 pt-12 sm:pt-14">
          {/* Company */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.2em] text-background/50 mb-5">
              COMPANY
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-background/40 hover:text-background transition-colors duration-300"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.2em] text-background/50 mb-5">
              SOCIAL
            </h4>
            <ul className="space-y-3">
              {socialLinks?.linkedin && (
                <li>
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-background/40 hover:text-background transition-colors duration-300"
                  >
                    LinkedIn
                  </a>
                </li>
              )}
              {socialLinks?.twitter && (
                <li>
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-background/40 hover:text-background transition-colors duration-300"
                  >
                    X / Twitter
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Venice / Footer CTA */}
          {footerCta && (footerCta.heading || footerCta.subtitle) && (
            <div>
              {footerCta.heading && (
                <h4 className="text-[10px] font-bold tracking-[0.2em] text-background/50 mb-5">
                  {footerCta.heading.toUpperCase()}
                </h4>
              )}
              {footerCta.subtitle && (
                <p className="text-sm text-background/40 leading-relaxed mb-4">
                  {footerCta.subtitle}
                </p>
              )}
              {footerCta.linkUrl && (
                <a
                  href={footerCta.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-background/60 hover:text-background transition-colors duration-300"
                >
                  {footerCta.linkText || "Learn More"}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] tracking-[0.2em] text-background/30">
            &copy; 2026 {title.toUpperCase()}. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-[10px] tracking-[0.2em] text-background/30 hover:text-background transition-colors duration-300"
            >
              PRIVACY
            </Link>
            <Link
              href="/terms"
              className="text-[10px] tracking-[0.2em] text-background/30 hover:text-background transition-colors duration-300"
            >
              TERMS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
