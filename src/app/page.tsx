import IntroductionSection from "@/components/home/introductionSection";
import TechStackSection from "@/components/home/techStackSection";
import ProjectsSection from "@/components/home/projectsSections";

export default function Home() {
  return (
    <div className="w-full">
      <div className="w-full rounded-b-[75px]  sm:rounded-b-[100px] bg-c-white-500 pb-32">
        <IntroductionSection/>
      </div>

      <div className="relative -z-10 h-[225px]">
        <div className="absolute bg-c-white-100 w-full h-[200%] rounded-b-[75px] sm:rounded-b-[100px] -translate-y-1/2 -z-50"/>
        <TechStackSection/>
      </div>

      <div className="container mx-auto pt-16 mb-16">
        <ProjectsSection/>
      </div>
    </div>
  );
}
