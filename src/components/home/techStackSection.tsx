// TechStackSection.jsx
import { 
  SiNextdotjs, SiReact, SiTailwindcss, SiSupabase, 
  SiFirebase, SiNodedotjs, SiTypescript, SiJavascript, 
  SiCss3, SiHtml5, SiGit, SiFlutter
} from "react-icons/si";

import TechItem from './techItem';

const techStack = [
  { icon: <SiNextdotjs size={32} />, name: "Next.js" },
  { icon: <SiReact size={32} />, name: "React" },
  { icon: <SiTailwindcss size={32} />, name: "Tailwind CSS" },
  { icon: <SiSupabase size={32} />, name: "Supabase" },
  { icon: <SiFirebase size={32} />, name: "Firebase" },
  { icon: <SiNodedotjs size={32} />, name: "Node.js" },
  { icon: <SiTypescript size={32} />, name: "TypeScript" },
  { icon: <SiJavascript size={32} />, name: "JavaScript" },
  { icon: <SiCss3 size={32} />, name: "CSS3" },
  { icon: <SiHtml5 size={32} />, name: "HTML5" },
  { icon: <SiGit size={32} />, name: "Git" },
  { icon: <SiFlutter size={32} />, name: "Flutter" },
];

export default function TechStackSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-medium text-center text-gray-800 mb-16">
          Technologies I Work With
        </h2>
        
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 max-w-4xl mx-auto">
          {techStack.map((tech, index) => (
            <TechItem 
              key={index}
              icon={tech.icon}
              name={tech.name}
            />
          ))}
        </div>
      </div>
    </section>
  );
}