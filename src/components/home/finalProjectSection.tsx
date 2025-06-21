import Button from "@/components/ui/button";

export default function FinalProjectSection() {
  const project = {
    title: "AI-Powered Business Management Platform",
    description: "A comprehensive SaaS solution that automates project staffing and talent allocation through AI-powered CV analysis, secure multi-tenant architecture with RBAC, intelligent document management with semantic search, and conversational AI features. Built using agile Scrum methodology with full end-to-end development.",
    tech: [
      "Next.js",
      "Tailwind CSS",
      "Supabase",
      "PostgreSQL",
      "Redis",
      "NextAuth.js",
      "Google Gemini",
      "Cohere",
      "Resend"
    ],
    videoUrl: "https://www.youtube.com/embed/3Na58H14JbM",
    presentationUrl: "https://drive.google.com/file/d/1zRpL3h7grnZPnMRVoKZ_qFlwwRivlQux/view?usp=sharing",
    reportUrl: "https://drive.google.com/file/d/1QnWoHG6c-t2V0rIHA1W9vnOsbIBcZXdM/view",
  };

  return (
    <div className="w-full py-20 lg:py-28" id="final-project">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Capstone Project Showcase
          </h2>
          <p className="mt-4 text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            A highlight of my academic and practical skills in action.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">          <div className="rounded-lg overflow-hidden border">
            <iframe
              src={project.videoUrl}
              className="w-full h-auto aspect-video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={project.title}
            >
            </iframe>
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl font-bold tracking-tighter sm:text-3xl">
              {project.title}
            </h3>
            <p className="text-muted-foreground">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-full select-none"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <a href={project.presentationUrl} target="_blank" rel="noopener noreferrer">
                  View Presentation
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={project.reportUrl} target="_blank" rel="noopener noreferrer">
                  Read Full Report
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}