interface ProjectCardProps {
  title: string;
  description: string;
  tech: string[];
  link: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function ProjectCard({ 
  title, 
  description, 
  tech, 
  link,
  className,
  style
}: ProjectCardProps){
  return (
    <div 
      className={`group relative bg-background rounded-xl p-6 border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${className || ''}`}
      style={style}
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
      
      <h3 className="text-xl font-semibold text-foreground mb-3">
        {title}
      </h3>
      
      <p className="text-muted-foreground mb-4">
        {description}
      </p>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {tech.map((tech, index) => (
          <span
            key={index}
            className="px-2 py-0.5 text-xs bg-secondary text-muted-foreground rounded-full select-none transition-colors"
          >
            {tech}
          </span>
        ))}
      </div>
      
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-primary hover:text-primary/80 transition-colors font-medium"
      >
        <span>View Project</span>
        <svg
          className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </a>
    </div>
  );
};