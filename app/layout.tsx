import type { Metadata } from "next";
import "./globals.css";
import NoSSR from "@/components/NoSSR";
import AppShell from "@/components/AppShell";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://optimalsports.net"),
  title: "Optimal Sports Management",
  description:
    "Optimal Sports Management is a full-service agency representing elite athletes. With a foundation built on trust, discipline, and purpose, we strive to elevate our clients and redefine the standard of excellence in sports representation.",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' }
    ],
    shortcut: '/favicon.svg',
    apple: '/logo-optimal.svg',
  },
  openGraph: {
    title: "Optimal Sports Management",
    description:
      "Optimal Sports Management is a full-service agency representing elite athletes. With a foundation built on trust, discipline, and purpose, we strive to elevate our clients and redefine the standard of excellence in sports representation.",
    url: "https://optimalsports.net",
    siteName: "Optimal Sports Management",
    locale: "en_US",
    images: [
      {
        url: "https://optimalsports.net/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Optimal Sports Management",
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Optimal Sports Management",
    description:
      "Optimal Sports Management is a full-service agency representing elite athletes. With a foundation built on trust, discipline, and purpose, we strive to elevate our clients and redefine the standard of excellence in sports representation.",
    images: ["https://optimalsports.net/twitter-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Strip extension-injected attributes that cause hydration mismatches (e.g., bis_skin_checked) */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(() => { const clean = () => { try { document.querySelectorAll('[bis_skin_checked]').forEach(el => el.removeAttribute('bis_skin_checked')); } catch(_) {} }; clean(); const start = performance.now(); const loop = () => { if (performance.now() - start < 2000) { clean(); requestAnimationFrame(loop); } }; requestAnimationFrame(loop); })();",
          }}
        />
        {/* Prefer PNG/SVG favicon with cache-buster to avoid stale icons */}
        <link rel="icon" href="/favicon.png?v=2" sizes="32x32" type="image/png" />
        <link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml" />
      </head>
      <body className="font-sans bg-white text-gray-900 dark:bg-black dark:text-white" suppressHydrationWarning>
        <ThemeProvider>
          <AppShell>
            <NoSSR>{children}</NoSSR>
          </AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
