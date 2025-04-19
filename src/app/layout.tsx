import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";

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
  title: "Mohamed Amine Guitouni - Full Stack Developer",
  description: "Portfolio of Mohamed Amine Guitouni, a Full-Stack Developer specializing in Next.js and modern web technologies.",
  openGraph: {
    title: "Mohamed Amine Guitouni Portfolio",
    description: "Full-Stack Developer specializing in Next.js. Building high-performance web applications with a focus on responsive design and seamless user experience.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground selection:bg-primary/30`}
      >
        <div className="relative flex min-h-screen flex-col">
          <Navbar/>
          <main className="flex-1">
            {children}
          </main>
          <Footer/>
        </div>
      </body>
    </html>
  );
}
