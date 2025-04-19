export default function TechItem({ icon, name }: { icon: React.ReactNode, name: string }) {
  
  return (
    <div 
      className="group flex flex-col items-center justify-center group"
    >
      <div className="p-4 rounded-full bg-gray-100 mb-3 transition-all duration-300 group-hover:shadow-md group-hover:scale-110">
        <div className="text-gray-700 group-hover:text-gray-900 transition-colors">
          {icon}
        </div>
      </div>
      <span className="text-sm font-medium text-gray-600 transition-all duration-300 group-hover:opacity-100 opacity-70">
        {name}
      </span>
    </div>
  );
}