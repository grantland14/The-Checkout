import Link from "next/link"

export default function Footer({ siteSettings }: { siteSettings: any }) {
  const title = siteSettings?.title || "THE CHECKOUT"
  const words = title.split(" ")
  const firstLine = words.slice(0, Math.ceil(words.length / 2)).join(" ")
  const secondLine = words.slice(Math.ceil(words.length / 2)).join(" ")

  return (
    <footer className="bg-foreground text-background">
      {/* Big Logo Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-12 sm:pb-16">
        <div className="font-black text-4xl sm:text-6xl lg:text-8xl text-background/90 leading-[0.9] tracking-tight">
          <div>{firstLine}</div>
          <div>{secondLine}</div>
        </div>
        <div className="w-24 h-[3px] bg-background/30 mt-6 mb-4" />
        {siteSettings?.footerTagline && (
          <p className="text-sm text-background/40 max-w-md">
            {siteSettings.footerTagline}
          </p>
        )}
      </div>

      {/* Links Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12">
          {/* CONTENT */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.2em] text-background/60 mb-4">
              CONTENT
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/feed"
                  className="text-sm text-background/50 hover:text-background transition"
                >
                  Feed
                </Link>
              </li>
              <li>
                <Link
                  href="/data"
                  className="text-sm text-background/50 hover:text-background transition"
                >
                  Data
                </Link>
              </li>
              <li>
                <Link
                  href="/reports"
                  className="text-sm text-background/50 hover:text-background transition"
                >
                  Reports
                </Link>
              </li>
              <li>
                <Link
                  href="/podcast"
                  className="text-sm text-background/50 hover:text-background transition"
                >
                  Podcast
                </Link>
              </li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.2em] text-background/60 mb-4">
              COMPANY
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-background/50 hover:text-background transition"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/team"
                  className="text-sm text-background/50 hover:text-background transition"
                >
                  Team
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-sm text-background/50 hover:text-background transition"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-background/50 hover:text-background transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* SOCIAL */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.2em] text-background/60 mb-4">
              SOCIAL
            </h4>
            <ul className="space-y-3">
              {siteSettings?.socialLinks?.twitter && (
                <li>
                  <a
                    href={siteSettings.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-background/50 hover:text-background transition"
                  >
                    Twitter/X
                  </a>
                </li>
              )}
              {siteSettings?.socialLinks?.linkedin && (
                <li>
                  <a
                    href={siteSettings.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-background/50 hover:text-background transition"
                  >
                    LinkedIn
                  </a>
                </li>
              )}
              {siteSettings?.socialLinks?.youtube && (
                <li>
                  <a
                    href={siteSettings.socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-background/50 hover:text-background transition"
                  >
                    YouTube
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* VENICE NETWORK */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.2em] text-background/60 mb-4">
              VENICE NETWORK
            </h4>
            <p className="text-sm text-background/50 mb-3">
              Private network for 7-figure European founders.
            </p>
            <a
              href="https://www.venicefounders.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-background/50 hover:text-background transition font-bold"
            >
              APPLY --&gt;
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] tracking-[0.2em] text-background/40">
            &copy; 2026 {title.toUpperCase()}. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-[10px] tracking-[0.2em] text-background/40 hover:text-background transition"
            >
              PRIVACY
            </Link>
            <Link
              href="/terms"
              className="text-[10px] tracking-[0.2em] text-background/40 hover:text-background transition"
            >
              TERMS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
