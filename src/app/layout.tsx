import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";
import Head from 'next/head';

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
  title: "portfolio",
  description: "Mohamed Amine Guitouni Portfolio",
};

const webSiteMetaData = {
  title: "Mohamed Amine Guitouni Portfolio",
  description: "Mohamed Amine Guitouni - Full-Stack Developer specializing in Next.js. Building high-performance web applications with a focus on responsive design and seamless user experience.",
  url: "https://www.guitouni-studio.online",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <>
      <Head>
        <title>Your Website Title</title>
        <meta name="description" content={webSiteMetaData.description} />
        <meta property="og:title" content={webSiteMetaData.title} />
        <meta property="og:description" content={webSiteMetaData.description} />
        <meta property="og:image" content="/public/meta_image.png" />
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="447" />
        <meta property="og:url" content={webSiteMetaData.url} />
        <meta property="og:type" content="website" />
      </Head>
      </>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-vw bg-c-white-500`}
      >
        <main className="w-full overflow-hidden">
          <Navbar/>
          {children}
          <Footer/>
        </main>
      </body>
    </html>
  );
}
