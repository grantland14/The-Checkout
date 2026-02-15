"use client"

import { useState } from "react"
import Link from "next/link"
import { urlFor } from "@/lib/sanity"

export default function Header({ siteSettings }: { siteSettings: any }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center h-[4.5rem]">
          {/* Logo */}
          <Link href="/" className="shrink-0 hover:opacity-70 transition-opacity duration-300">
            {siteSettings?.logo ? (
              <img
                src={urlFor(siteSettings.logo).height(32).url()}
                alt={siteSettings.title || "Logo"}
                className="h-7 sm:h-8 w-auto"
              />
            ) : (
              <span className="text-lg font-black tracking-tight whitespace-nowrap">
                {siteSettings?.title || "THE CHECKOUT"}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center ml-6 self-stretch border-l border-border">
            {siteSettings?.navigation?.map(
              (item: { label: string; url: string }, index: number) => (
                <Link
                  key={index}
                  href={item.url}
                  className="text-[11px] font-bold tracking-[0.12em] uppercase text-muted-foreground hover:text-foreground hover:bg-card transition-all duration-300 px-5 self-stretch flex items-center border-r border-border"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Subscribe Button (Desktop) */}
          <Link
            href="/subscribe"
            className="hidden sm:inline-flex bg-foreground text-background px-8 self-stretch items-center font-bold text-[11px] tracking-[0.15em] btn-subscribe transition-all duration-300"
          >
            SUBSCRIBE
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-12 h-12 bg-foreground text-background flex items-center justify-center shrink-0"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="flex flex-col">
            {siteSettings?.navigation?.map(
              (item: { label: string; url: string }, index: number) => (
                <Link
                  key={index}
                  href={item.url}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[11px] font-bold tracking-[0.12em] uppercase text-muted-foreground hover:text-foreground hover:bg-card transition-all duration-300 px-6 py-4 border-b border-border"
                >
                  {item.label}
                </Link>
              )
            )}
            <Link
              href="/subscribe"
              onClick={() => setMobileMenuOpen(false)}
              className="mx-6 my-4 inline-flex justify-center bg-foreground text-background px-6 py-3.5 font-bold text-[11px] tracking-[0.15em] btn-subscribe transition-all duration-300"
            >
              SUBSCRIBE
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
