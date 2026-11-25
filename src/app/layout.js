import "./globals.css";
import { Poppins } from "next/font/google";
import Navbar from '@/components/layouts/Navbar'
import Footer from '@/components/layouts/Footer'
import { site } from "@/lib/site";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rcuk.org.uk";

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.shortName}`,
  },
  description:
    "The Rohingya Centre of United Kingdom (RCUK) is a community-led charity rebuilding communities and hope for Rohingya people through education, advocacy, language services and cultural preservation.",
  keywords: ["Rohingya", "RCUK", "Rohingya Centre UK", "charity", "Bradford", "human rights"],
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_GB",
    url: baseUrl,
    title: `${site.name} — ${site.tagline}`,
    description:
      "A community-led charity rebuilding communities and hope for Rohingya people in the UK.",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans`}>
        
        {/*Navigation Bar*/}
        <Navbar />
        
        {children}
        
        {/*Footer Section*/}
        <Footer />
      </body>
    </html>
  );
}
