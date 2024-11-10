import ProjectCard from "./projectCard";

export default function ProjectsSection() {
    const projects = [
        {
          title: "MegaTel Platform",
          description: "Employee Productivity Platform to streamline communication and workflow",
          tech: ["Next.js", "React", "TailwindCSS", "Supabase", "Ai ChatBot", "Google Api"],
          link: "https://platform.mega-tel.de"
        },
        {
          title: "E-Learning Platform",
          description: "University e-learning platform with an AI-powered virtual teacher chatbot.",
          tech: ["Next.js", "React", "TailwindCSS", "Firebase", "Ai ChatBot"],
          link: "https://courima.guitouni-studio.online"
        },
        {
          title: "Wordle Clone",
          description: "A clone of the popular game Wordle.",
          tech: ["Next.js", "TailwindCSS", "React", "Firebase"],
          link: "https://wordle.guitouni-studio.online"
        }
      ];
    return (
        <div className="w-full space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-c-gray-100 to-[hsl(0,0%,40%)] bg-clip-text text-transparent">
                  Project I Worked On
                </h1>
            </div>

            <div className="flex flex-col gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project, index) => <ProjectCard key={index} {...project} />)}
            </div>
        </div>
    )
}