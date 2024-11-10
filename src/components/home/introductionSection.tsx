import Image from "next/image";
import profile_image from "@/../public/amine_pic.jpg";
import { PiArrowLineUpRightLight } from "react-icons/pi";
import Button from "../ui/button";

export default function IntroductionSection() {
    return(
        <section className="container mx-auto flex flex-col items-center pt-16 gap-10 bg-c-white-500 rounded-b-3xl relative">
          <div className="relative">
            <div className="bg-c-white-100 rounded-full flex justify-center items-center size-[125px] border shadow-sm">
              <Image
                src={profile_image}
                alt="profile"
                width={120}
                height={120}
                className="rounded-full"
              />
            </div>
            <span className="absolute bg-c-white-100 rounded-full text-center py-1 px-3 text-xs sm:text-sm font-semibold top-[20%] right-0 translate-x-[80%] sm:top-[15%] sm:translate-x-[87%] -rotate-12 shadow-sm sm:text-nowrap">
              Mohamed Amine Guitouni 👋
            </span>
          </div>
          <div className="text-center max-w-[300px] sm:max-w-[500px]">
              <h1 className="text-4xl sm:text-5xl bg-gradient-to-r from-c-gray-100 to-[hsl(0,0%,40%)] bg-clip-text text-transparent">
                Building seamless web experiences with Next.js
              </h1>
          </div>
          <Button className="bg-c-gray-100 text-c-white-100 py-4 px-8 text-md hover:bg-[hsl(0,0%,25%)]">
            learn more <PiArrowLineUpRightLight className="inline-block"/>
          </Button>
        </section>
    )
}