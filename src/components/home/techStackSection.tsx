import { SiNextdotjs, SiReact, SiTailwindcss, SiSupabase, SiFirebase, SiNodedotjs, SiTypescript, SiJavascript, SiCss3, SiHtml5, SiGit } from "react-icons/si";

/*************  ✨ Codeium Command ⭐  *************/
/******  a1821034-bbe0-4efa-89c6-e08dcd07ba98  *******/
export default function TechStackSection() {
    return (
        <div className="container mx-auto relative flex items-center h-full ">
          <div className="w-full flex flex-col items-center gap-8">
            <div className="text-center w-[400px]">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-c-gray-100 to-[hsl(0,0%,40%)] bg-clip-text text-transparent">
                  My Tech-Stack
                </h1>
            </div>
            <div className="flex max-w-[800px] w-[80%] overflow-hidden group shaded-edges">
                <div className="flex flex-shrink-0 animate-loop-scroll-left group-hover:paused flex-grow-0">
                  <SiNextdotjs size={40} className="text-c-gray-100 mx-4"/>
                  <SiReact size={40} className="text-c-gray-100 mx-4"/>
                  <SiTailwindcss size={40} className="text-c-gray-100 mx-4"/>
                  <SiSupabase size={40} className="text-c-gray-100 mx-4"/>
                  <SiFirebase size={40} className="text-c-gray-100 mx-4"/>
                  <SiNodedotjs size={40} className="text-c-gray-100 mx-4"/>
                  <SiTypescript size={40} className="text-c-gray-100 mx-4"/>
                  <SiJavascript size={40} className="text-c-gray-100 mx-4"/>
                  <SiCss3 size={40} className="text-c-gray-100 mx-4"/>
                  <SiHtml5 size={40} className="text-c-gray-100 mx-4"/>
                  <SiGit size={40} className="text-c-gray-100 mx-4"/>
                </div>
                <div className="flex flex-shrink-0 animate-loop-scroll-left group-hover:paused flex-grow-0" aria-hidden="true">
                  <SiNextdotjs size={40} className="text-c-gray-100 mx-4"/>
                  <SiReact size={40} className="text-c-gray-100 mx-4"/>
                  <SiTailwindcss size={40} className="text-c-gray-100 mx-4"/>
                  <SiSupabase size={40} className="text-c-gray-100 mx-4"/>
                  <SiFirebase size={40} className="text-c-gray-100 mx-4"/>
                  <SiNodedotjs size={40} className="text-c-gray-100 mx-4"/>
                  <SiTypescript size={40} className="text-c-gray-100 mx-4"/>
                  <SiJavascript size={40} className="text-c-gray-100 mx-4"/>
                  <SiCss3 size={40} className="text-c-gray-100 mx-4"/>
                  <SiHtml5 size={40} className="text-c-gray-100 mx-4"/>
                  <SiGit size={40} className="text-c-gray-100 mx-4"/>
                </div>
            </div>
          </div>
        </div>
    )
}