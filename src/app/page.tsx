import FinalProjectSection from "@/components/home/finalProjectSection";
import IntroductionSection from "@/components/home/introductionSection";
import TechStackSection from "@/components/home/techStackSection";
import ProjectsSection from "@/components/home/projectsSections";

export default function Home() {
  return (
    <div className="w-full flex flex-col gap-y-8">
      <div className="w-full rounded-b-[75px] sm:rounded-b-[100px] bg-gradient-to-b from-background to-muted/50 pb-32">
        <IntroductionSection/>
      </div>

      <div className="relative h-fit">
        <div className="absolute bg-gradient-to-b from-muted/50 to-background w-full h-[200%] rounded-b-[75px] sm:rounded-b-[100px] -translate-y-1/2 -z-50"/>
        <TechStackSection/>
      </div>

      <FinalProjectSection />
      <div className="container mx-auto">
        <ProjectsSection/>
      </div>
    </div>
  );
}
