import Button from "../ui/button";
import { FaLinkedinIn, FaGithub } from "react-icons/fa";
import { MdOutlineEmail, MdOutlineFilePresent } from "react-icons/md";
import CopyMailBtn from "./copyMailBtn";

export default function Navbar() {
    return (
        <nav className="w-full sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex justify-between items-center h-16 px-4 mx-auto">
                <div className="flex gap-3 items-center">
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100">
                        <MdOutlineEmail className="text-gray-600 size-4" />
                        <span className="text-sm text-gray-700 font-medium select-none">
                            guitouni.medamine@gmail.com
                        </span>
                    </div>
                    
                    <CopyMailBtn 
                        variant="ghost" 
                        size="sm" 
                        className="hidden sm:flex hover:bg-gray-100 text-gray-700"
                    >
                        Copy
                    </CopyMailBtn>

                    <CopyMailBtn 
                        variant="ghost" 
                        size="sm" 
                        className="sm:hidden flex items-center gap-1 hover:bg-gray-100 text-gray-700"
                    >
                        <MdOutlineEmail className="size-4" />
                        <span>Email</span>
                    </CopyMailBtn>
                    
                    <a 
                      target="_blank" 
                      rel="noopener noreferrer"
                      href="https://drive.google.com/file/d/1scW8rRjqzqqn3mJQkziJzWeoMuZaxzXJ/view?usp=sharing"
                      className="transition-all duration-200"
                    >
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-gray-200 hover:border-gray-400 flex items-center gap-1"
                        >
                            <MdOutlineFilePresent className="size-4" />
                            <span>View CV</span>
                        </Button>
                    </a>
                </div>

                <div className="flex gap-6 items-center">
                    <a 
                      href="https://www.linkedin.com/in/mohamed-amine-guitouni-44a400328/" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1.5"
                    >
                        <FaLinkedinIn className="size-4" />
                        <span className="hidden sm:inline text-sm font-medium">
                            LinkedIn
                        </span>
                    </a>
                    <a 
                      href="https://github.com/AmineGuitouni" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1.5"
                    >
                        <FaGithub className="size-4" />
                        <span className="hidden sm:inline text-sm font-medium">
                            GitHub
                        </span>
                    </a>
                </div>
            </div>
        </nav>
    );
}