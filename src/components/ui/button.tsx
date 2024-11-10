"use client"
import { cn } from "@/lib/utils";

export default function Button({
    children,
    className,
    ...props
}:{
    children: React.ReactNode,
    className?: string,
} & React.ButtonHTMLAttributes<HTMLButtonElement>
) {
    return (
        <button className={cn("px-4 py-2 rounded-full bg-c-white-100 text-sm shadow-sm hover:bg-[hsl(0,0%,85%)] hover:shadow-md transition-all duration-200", className)} {...props}>
            {children}
        </button>
    )
}