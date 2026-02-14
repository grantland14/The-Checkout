import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/lib/queries";
import { urlFor } from "@/lib/sanity";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
});

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();

  const title =
    siteSettings?.metaTitle ||
    siteSettings?.title ||
    "The Checkout | European eCommerce Intelligence";
  const description =
    siteSettings?.metaDescription ||
    siteSettings?.description ||
    "Essential eCommerce intelligence for European operators.";
  const siteUrl = siteSettings?.siteUrl || "https://thecheckout.media";

  const ogImageUrl = siteSettings?.ogImage
    ? urlFor(siteSettings.ogImage).width(1200).height(630).url()
    : undefined;

  const faviconUrl = siteSettings?.favicon
    ? urlFor(siteSettings.favicon).width(32).height(32).url()
    : undefined;

  return {
    title: {
      default: title,
      template: `%s | ${siteSettings?.title || "The Checkout"}`,
    },
    description,
    metadataBase: new URL(siteUrl),
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: siteSettings?.title || "The Checkout",
      type: "website",
      ...(ogImageUrl && {
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: siteSettings?.title || "The Checkout",
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
    ...(faviconUrl && {
      icons: {
        icon: faviconUrl,
        shortcut: faviconUrl,
        apple: siteSettings?.favicon
          ? urlFor(siteSettings.favicon).width(180).height(180).url()
          : undefined,
      },
    }),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${instrumentSerif.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
