import Button from "./ui/button";
import { MdOutlineEmail, MdWhatsapp } from "react-icons/md";
import { LiaCopyright } from "react-icons/lia";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
    return(
        <footer className="w-full bg-secondary border-t border-border/40 mt-16 pt-16 pb-8">
            <div className="container mx-auto h-full flex flex-col items-center gap-12">
                <div className="text-center max-w-2xl space-y-6">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent pb-2">
                        Let&apos;s Build Something Amazing
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Have a project in mind? I&apos;d love to hear about it.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <a 
                      target="_blank" 
                      rel="noopener noreferrer"
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=guitouni.medamine@gmail.com"
                    >
                        <Button variant="default" size="lg">
                            <MdOutlineEmail size={20} className="mr-2"/> Email Me
                        </Button>
                    </a>

                    <a 
                      href="https://wa.me/21656522039" 
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                        <Button variant="outline" size="lg">
                            <MdWhatsapp size={20} className="mr-2"/> WhatsApp
                        </Button>
                    </a>
                </div>

                <div className="w-full text-sm text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-6 border-t border-border/40">
                    <div className="flex items-center">
                        <LiaCopyright size={16} className="mr-1"/> 2025 Mohamed Amine Guitouni. All rights reserved.
                    </div>

                    <div className="flex gap-4 items-center">
                        <a 
                          href="https://www.linkedin.com/in/mohamed-amine-guitouni-44a400328/" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <span className="hidden sm:inline">LinkedIn</span>
                            <FaLinkedinIn className="sm:hidden size-5" />
                        </a>
                        <a 
                          href="https://github.com/AmineGuitouni" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <span className="hidden sm:inline">GitHub</span>
                            <FaGithub className="sm:hidden size-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}