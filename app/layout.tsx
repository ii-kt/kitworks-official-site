import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Cormorant_Garamond, DM_Sans, Shippori_Mincho, Zen_Kaku_Gothic_New } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({ variable: "--font-display", subsets: ["latin"], weight: ["400", "500", "600"] });
const sans = DM_Sans({ variable: "--font-sans", subsets: ["latin"], weight: ["400", "500", "600"] });
const japanese = Zen_Kaku_Gothic_New({
  variable: "--font-jp-modern",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});
const japaneseDisplay = Shippori_Mincho({
  variable: "--font-jp-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000080",
};

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const title = "KiT Works｜デザインとフロントエンド開発";
  const description = "KiT Worksは、Webデザイン、フロントエンド開発、インタラクティブなデジタル体験を一貫して手がける個人事業です。";

  return {
    title,
    description,
    openGraph: { title, description, url: origin, siteName: "KiT Works", type: "website", locale: "ja_JP", images: [{ url: `${origin}/og.png`, width: 1734, height: 907, alt: "KiT Works - Independent Design and Development Practice" }] },
    twitter: { card: "summary_large_image", title, description, images: [`${origin}/og.png`] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body className={`${display.variable} ${sans.variable} ${japanese.variable} ${japaneseDisplay.variable}`}>{children}</body></html>;
}
