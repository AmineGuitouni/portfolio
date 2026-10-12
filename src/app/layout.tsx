import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.guitouni-studio.online"),
  title: "Mohamed Amine Guitouni — Full-Stack & Systems Engineer",
  description: "Portfolio of Mohamed Amine Guitouni, a full-stack & systems engineer building products end to end with Next.js, Go, Rust, PostgreSQL and AI.",
  openGraph: {
    title: "Mohamed Amine Guitouni — Full-Stack & Systems Engineer",
    description: "Platforms, realtime systems and applied AI — React interfaces, Go and Rust services, PostgreSQL data, shipped to production.",
    url: "https://www.guitouni-studio.online",
    images: [
      {
        url: "/meta_image.png",
        width: 800,
        height: 447,
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[#FAFAF7] text-[#111111]`}
      >
        {children}
      </body>
    </html>
  );
}
