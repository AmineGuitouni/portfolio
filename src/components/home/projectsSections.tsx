import ProjectCard from "./projectCard";

export default function ProjectsSection() {
    const projects = [
        {
          title: "MegaTel Platform",
          description: "Employee Productivity Platform to streamline communication and workflow",
          tech: ["Next.js", "React", "TailwindCSS", "Supabase", "AI ChatBot", "Google API"],
          link: "https://mega-tel.de"
        },
        {
          title: "E-Learning Platform",
          description: "University e-learning platform with an AI-powered virtual teacher chatbot.",
          tech: ["Next.js", "React", "TailwindCSS", "Firebase", "AI ChatBot"],
          link: "https://courima.guitouni-amine.me"
        },
        {
          title: "Wordle Clone",
          description: "A clone of the popular game Wordle with daily challenges and leaderboards.",
          tech: ["Next.js", "TailwindCSS", "React", "Firebase"],
          link: "https://wordle.guitouni-amine.me"
        }
      ];

    return (
        <div className="w-full space-y-12" id="projects">
            <div className="text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Featured Projects
                </h2>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                  Here are some of my recent projects showcasing my skills and experience
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, index) => (
                  <ProjectCard 
                    key={index} 
                    {...project} 
                    className="opacity-0 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
                  />
                ))}
            </div>
        </div>
    )
}
