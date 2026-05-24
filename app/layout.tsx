import type { Metadata } from "next";
import { Cinzel, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";
import { SITE } from "../config/site.config";
import { ThemeProvider } from "next-themes";
import ThemeHeadIcons from "../components/ui/ThemeHeadIcon";
import ClientWrapper from "../components/ui/ClientWrapper";
import { ImmersiveModeProvider } from "../contexts/ImmersiveModeContext";
import ImmersiveTransitionOverlay from "../components/ui/ImmersiveTransitionOverlay";
import ImmersiveBackground from "../components/ui/ImmersiveBackground";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";

const ScrollToTop = dynamic(() =>
  import("../components/scroll-to-top").then((mod) => mod.ScrollToTop),
);
const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Silver — Software Engineer",
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: {
    title: "Silver — Software Engineer",
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Silver — Software Engineer",
    description: SITE.description,
    creator: SITE.twitterHandle,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      {
        url: "/icon_d.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/icon.svg",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} ${cinzel.variable}`}
    >
      <head>
        <ThemeHeadIcons />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          value={{ light: "light", dark: "dark" }}
        >
          <ImmersiveModeProvider>
            <ImmersiveTransitionOverlay />
            <ImmersiveBackground>
              <div className="group/layout">
                <SiteHeader />
                <main className="max-w-screen overflow-x-clip px-2">
                  <div
                    className="mx-auto md:max-w-3xl border-x"
                    style={{ borderColor: "var(--line)" }}
                  >
                    <ClientWrapper>{children}</ClientWrapper>
                  </div>
                </main>
                <SiteFooter />
                <ScrollToTop />
              </div>
            </ImmersiveBackground>
          </ImmersiveModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
