import { PiHandshake } from "react-icons/pi";
import Button from "./ui/button";
import { MdOutlineEmail, MdWhatsapp } from "react-icons/md";
import { LiaCopyright } from "react-icons/lia";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
    return(
        <footer className="w-full bg-c-white-100 min-h-32 rounded-t-[75px] sm:rounded-t-[100px] pt-16 pb-4 px-4">
            <div className="container mx-auto h-full flex flex-col items-center gap-8">
                <div className="size-[100px] bg-gradient-to-b from-c-white-500 rounded-full">
                    <PiHandshake size={75} className="text-c-gray-100 top-[50%] left-[50%] relative translate-x-[-50%] translate-y-[-50%]"/>
                </div>

                <div className="text-center max-w-[400px] sm:max-w-[500px]">
                    <h1 className="text-4xl sm:text-5xl bg-gradient-to-r from-c-gray-100 to-[hsl(0,0%,40%)] bg-clip-text text-transparent">
                        Tell me about your next project
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <a target="_blank" href="https://mail.google.com/mail/?view=cm&fs=1&to=guitouni.medamine@gmail.com">
                        <Button className="bg-c-gray-100 text-c-white-100 py-4 px-8 text-sm hover:bg-[hsl(0,0%,25%)]">
                        <MdOutlineEmail size={20} className="inline-block mr-1"/> Email Me
                        </Button>
                    </a>

                    <a href="https://wa.me/21656522039">
                        <Button className="py-4 px-8 text-sm bg-c-white-500">
                            <MdWhatsapp size={20} className="inline-block mr-1"/> WhatsApp
                        </Button>
                    </a>
                </div>

                <hr className="border-c-gray-100 mt-12 border-1 w-full"/>

                <div className="w-full text-xs flex items-center justify-between">
                    <span>
                        <LiaCopyright size={15} className="inline-block mr-1"/> 2024 All rights reserved.
                    </span>

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
            </div>
        </footer>
    )
}