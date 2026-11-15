import { fraunces } from "@/components/fonts";
import CaseNav from "../case-nav";
import Hero from "./hero";
import Tiers from "./tiers";
import Dollar from "./dollar";
import Resilience from "./resilience";
import Operations from "./operations";
import Outro from "./outro";
import { ACCENT } from "./tokens";

const CHAPTERS = [
  { id: "system", label: "System" },
  { id: "dollar", label: "A dollar" },
  { id: "resilience", label: "Resilience" },
  { id: "operations", label: "Operations" },
  { id: "numbers", label: "Numbers" },
];

export default function LaundererCaseStudy() {
  return (
    <div
      className={`${fraunces.variable} min-h-screen overflow-x-clip bg-[#FAFAF7] text-[#111111] antialiased selection:bg-[#2E6BFF] selection:text-white`}
      style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
    >
      <CaseNav name="Launderer" chapters={CHAPTERS} accent={ACCENT} />
      <main>
        <Hero />
        <Tiers />
        <Dollar />
        <Resilience />
        <Operations />
        <Outro />
      </main>
    </div>
  );
}
