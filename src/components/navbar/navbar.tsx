import Button from "../ui/button";
import { FaLinkedinIn } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import CopyMailBtn from "./copyMailBtn";

export default function Navbar() {
    return (
        <nav className="w-full">
            <div className="flex justify-between items-center container mx-auto p-4">
                <div className="flex gap-4 items-center">
                    <span className="hover:underline transition-all duration-200 hidden sm:inline select-none">guitouni.medamine@gmail.com</span>
                    <CopyMailBtn className="hidden sm:block">
                        Copy
                    </CopyMailBtn>

                    <CopyMailBtn className="sm:hidden">
                        Email
                    </CopyMailBtn>
                    <a target="_blank" href="https://drive.google.com/file/d/1scW8rRjqzqqn3mJQkziJzWeoMuZaxzXJ/view?usp=sharing">
                        <Button className="w-[75px]">
                            CV
                        </Button>
                    </a>
                </div>

                <div className="flex gap-1 sm:gap-2 items-center">
                    <a href="https://www.linkedin.com/in/mohamed-amine-guitouni-44a400328/" target="_blank" className="text-sm hover:underline">
                        <span className="hidden sm:inline">
                            Linkedin
                        </span>
                        <FaLinkedinIn className="sm:hidden" />
                    </a>
                    <span>/</span>
                    <a href="https://github.com/AmineGuitouni" target="_blank" className="text-sm hover:underline">
                        <span className="hidden sm:inline">
                            Github
                        </span>
                        <FaGithub className="sm:hidden" />
                    </a>
                </div>
            </div>
        </nav>
    );
}