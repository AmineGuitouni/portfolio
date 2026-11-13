import { Fraunces } from "next/font/google";
import Nav from "./nav";
import Hero from "./hero";
import Manifesto from "./manifesto";
import Proof from "./proof";
import Toolbox from "./toolbox";
import Experience from "./experience";
import Work from "./work";
import Contact from "./contact";
import { marqueeIcons } from "@/components/tech-icons";

const fraunces = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], axes: ["SOFT", "opsz"], variable: "--d5-serif" });

export default function Home() {
  return (
    <div
      className={`${fraunces.variable} min-h-screen bg-[#FAFAF7] text-[#111111] antialiased selection:bg-[#FF6A3D] selection:text-white`}
      style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
    >
      <Nav />
      <main>
        <Hero />
        <LogoMarquee />
        <Manifesto />
        <Proof />
        <Toolbox />
        <Experience />
        <Work />
      </main>
      <Contact />
    </div>
  );
}

function LogoMarquee() {
  return (
    <div className="relative overflow-hidden border-y border-black/5 bg-white py-6 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
      <div className="flex w-max" style={{ animation: "d5-marquee 40s linear infinite" }}>
        {[0, 1].map((k) => (
          <div key={k} aria-hidden={k === 1} className="flex shrink-0 items-center gap-12 pr-12">
            {marqueeIcons.map(({ name, Icon }) => (
              <span key={name + k} className="flex items-center gap-2 text-[#8A8A85] transition-colors hover:text-[#111]">
                <Icon className="size-6" />
                <span className="text-sm font-medium">{name}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
