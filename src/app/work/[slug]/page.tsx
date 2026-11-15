import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SmoothScroll from "@/components/smooth-scroll";
import MegaTelCaseStudy from "@/components/case-study/megatel";
import LaundererCaseStudy from "@/components/case-study/launderer";
import { projects } from "@/data/portfolio";

// One hand-built page per project; projects without one stay on the homepage only.
const PAGES: Record<string, React.ComponentType> = {
  megatel: MegaTelCaseStudy,
  launderer: LaundererCaseStudy,
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  const title = `${project.name} — Case study · Amine Guitouni`;
  return {
    title,
    description: project.summary,
    openGraph: { title, description: project.tagline, url: `/work/${slug}`, type: "article", images: [{ url: "/meta_image.png", width: 800, height: 447 }] },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const Page = PAGES[slug];
  if (!Page) notFound();
  return (
    <SmoothScroll>
      <Page />
    </SmoothScroll>
  );
}
