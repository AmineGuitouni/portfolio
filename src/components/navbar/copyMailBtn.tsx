"use client";
import Button from "../ui/button";
import { cn } from "@/lib/utils";
import type { ButtonProps } from "../ui/button";

interface CopyMailBtnProps extends ButtonProps {
  children: React.ReactNode;
  className?: string;
}

export default function CopyMailBtn({ 
  children, 
  className,
  variant = "ghost",
  size = "sm",
  ...props
}: CopyMailBtnProps) {
  const copyToClipboard = async () => {
    const text = "guitouni.medamine@gmail.com";
    await navigator.clipboard.writeText(text);
    alert("Email copied to clipboard!");
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(className)}
      onClick={copyToClipboard}
      {...props}
    >
      {children}
    </Button>
  );
}
