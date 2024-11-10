"use client";
import Button from "../ui/button";
import { cn } from "@/lib/utils";

export default function CopyMailBtn({ children, className }: { children: React.ReactNode; className?: string }) {
  const copyToClipboard = async () => {
    const text = "guitouni.medamine@gmail.com";
    await navigator.clipboard.writeText(text);
    alert("Email copied!");
  };

  return (
    <Button
      className={cn("w-[75px]", className)}
      onClick={copyToClipboard}
    >
      {children}
    </Button>
  );
}
