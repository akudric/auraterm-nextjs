import type { Metadata } from "next";
import { Work_Sans, Noto_Sans } from "next/font/google";
import "./globals.css";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: ["400", "500", "700", "900"],
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "AuraTerm",
  description: "Profesionalna ugradnja klimatizacijskih uređaja u vaš dom",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hr">
      <body
        className={`${workSans.variable} ${notoSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}