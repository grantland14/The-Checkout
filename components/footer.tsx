import Link from "next/link"

export default function Footer({ siteSettings }: { siteSettings: any }) {
  const title = siteSettings?.title || "THE CHECKOUT"
  const words = title.split(" ")
  const firstLine = words.slice(0, Math.ceil(words.length / 2)).join(" ")
  const secondLine = words.slice(Math.ceil(words.length / 2)).join(" ")

  const footerColumns = siteSettings?.footerColumns || []
  const footerCta = siteSettings?.footerCta

  return (
    <footer className="bg-foreground text-background">
      {/* Big Logo Section */}
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12 pt-16 sm:pt-24 pb-12 sm:pb-16">
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
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12 pb-12 sm:pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12">
          {/* Dynamic Link Columns */}
          {footerColumns.map((column: any, colIndex: number) => (
            <div key={colIndex}>
              <h4 className="text-[10px] font-bold tracking-[0.2em] text-background/60 mb-4">
                {column.title?.toUpperCase()}
              </h4>
              <ul className="space-y-3">
                {column.links?.map(
                  (link: { label: string; url: string }, linkIndex: number) => {
                    const isExternal =
                      link.url?.startsWith("http://") ||
                      link.url?.startsWith("https://")
                    return (
                      <li key={linkIndex}>
                        {isExternal ? (
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-background/50 hover:text-background transition"
                          >
                            {link.label}
                          </a>
                        ) : (
                          <Link
                            href={link.url || "/"}
                            className="text-sm text-background/50 hover:text-background transition"
                          >
                            {link.label}
                          </Link>
                        )}
                      </li>
                    )
                  }
                )}
              </ul>
            </div>
          ))}

          {/* Footer CTA (4th column) */}
          {footerCta && (footerCta.heading || footerCta.subtitle) && (
            <div>
              {footerCta.heading && (
                <h4 className="text-[10px] font-bold tracking-[0.2em] text-background/60 mb-4">
                  {footerCta.heading.toUpperCase()}
                </h4>
              )}
              {footerCta.subtitle && (
                <p className="text-sm text-background/50 mb-3">
                  {footerCta.subtitle}
                </p>
              )}
              {footerCta.linkUrl && (
                <a
                  href={footerCta.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-background/50 hover:text-background transition font-bold"
                >
                  {footerCta.linkText || "LEARN MORE -->"}
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
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
