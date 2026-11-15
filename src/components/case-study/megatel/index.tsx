import { fraunces } from "@/components/fonts";
import CaseNav from "../case-nav";
import Hero from "./hero";
import System from "./system";
import Shift from "./shift";
import Supervision from "./supervision";
import Admin from "./admin";
import Outro from "./outro";

const CHAPTERS = [
  { id: "system", label: "System" },
  { id: "shift", label: "The shift" },
  { id: "supervision", label: "Supervision" },
  { id: "admin", label: "Admin" },
  { id: "numbers", label: "Numbers" },
];

export default function MegaTelCaseStudy() {
  return (
    <div
      className={`${fraunces.variable} min-h-screen overflow-x-clip bg-[#FAFAF7] text-[#111111] antialiased selection:bg-[#FF6A3D] selection:text-white`}
      style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
    >
      <CaseNav name="MegaTel" chapters={CHAPTERS} />
      <main>
        <Hero />
        <System />
        <Shift />
        <Supervision />
        <Admin />
        <Outro />
      </main>
    </div>
  );
}
