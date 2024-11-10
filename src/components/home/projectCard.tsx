interface ProjectCardProps {
  title: string;
  description: string;
  tech: string[];
  link: string;
}

export default function ProjectCard({ title, description, tech, link }: ProjectCardProps){
  return (
    <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 mx-4">
      <h3 className="text-xl font-medium text-gray-800 mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-4">
        {description}
      </p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {tech.map((tech, index) => (
          <span
            key={index}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full select-none cursor-pointer hover:bg-gray-200"
          >
            {tech}
          </span>
        ))}
      </div>
      
      <a
        href={link}
        target="_blank"
        className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
      >
        <span>Visit Website</span>
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