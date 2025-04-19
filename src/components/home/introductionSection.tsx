import Image from "next/image";
import { PiArrowLineUpRightLight } from "react-icons/pi";
import { HiCode, HiMail } from "react-icons/hi";
import Button from "../ui/button";
import Link from "next/link";

export default function IntroductionSection() {
    return(
        <section className="container mx-auto flex flex-col items-center pt-12 md:pt-16 pb-8 gap-14 relative animate-fade-in">
          {/* Background accent elements */}
          <div className="absolute top-20 left-1/4 size-64 bg-primary/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 right-1/4 size-64 bg-secondary/5 rounded-full blur-3xl -z-10" />
          
          <div className="relative group">
            <div className="absolute inset-0 size-[150px] bg-gradient-to-r from-primary/30 to-secondary/30 rounded-full blur-md group-hover:blur-lg transition-all duration-500 -z-10"></div>
            <div className="bg-gradient-to-br from-primary/10 to-secondary/20 rounded-full flex justify-center items-center size-[150px] border border-white/10 shadow-lg">
              <Image
                src="/amine_pic.jpg"
                alt="Mohamed Amine Guitouni"
                width={140}
                height={140}
                className="rounded-full object-cover group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
            <div className="absolute top-0 left-0 size-full bg-gradient-to-tr from-transparent via-white/10 to-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          
          <div className="text-center max-w-2xl space-y-7">
              <div className="inline-block px-4 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700 mb-2">
                Full-Stack Developer
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-muted-foreground/80 bg-clip-text text-transparent leading-tight">
                Building the future,<br className="hidden sm:block" /> one line at a time
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                I craft high-performance, accessible web applications using Next.js and modern technologies,
                focused on creating seamless user experiences that drive results.
              </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-md">
            <Link href="#projects">
            <Button
              variant="default" 
              size="lg" 
              className="flex-1 animate-slide-up bg-gray-900 hover:bg-gray-800 shadow-md group"
            >
              <span className="flex items-center justify-center">
                View Projects 
                <PiArrowLineUpRightLight className="ml-2 size-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"/>
              </span>
            </Button>
            </Link>
            <a 
              target="_blank" 
              rel="noopener noreferrer"
              href="https://mail.google.com/mail/?view=cm&fs=1&to=guitouni.medamine@gmail.com"
            >
              <Button 
                variant="outline" 
                size="lg" 
                className="flex-1 animate-slide-up [animation-delay:0.2s] border-gray-200 hover:border-gray-400 shadow-sm"
              >
                <span className="flex items-center justify-center">
                  <HiMail className="mr-2 size-5" /> Contact Me
                </span>
              </Button>
            </a>
          </div>
          
          <div className="flex items-center gap-2 mt-8 text-sm text-muted-foreground">
            <div className="flex items-center">
              <div className="size-2 bg-green-500 rounded-full mr-2"></div>
              <span>Available for work</span>
            </div>
            <span className="text-muted-foreground/30">•</span>
            <div className="flex items-center">
              <HiCode className="mr-1 size-4" />
              <span>2+ years experience</span>
            </div>
          </div>
        </section>
    )
}