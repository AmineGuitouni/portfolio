import type { IconType } from "react-icons";
import {
  SiAnthropic, SiApachekafka, SiApachespark, SiDocker, SiDrizzle, SiFastapi, SiFramer, SiGo,
  SiHuggingface, SiJsonwebtokens, SiLangchain, SiNextdotjs, SiNodedotjs, SiOpenai, SiPostgresql,
  SiPython, SiPytorch, SiRadixui, SiReact, SiRedis, SiRust, SiStripe, SiSupabase, SiTailwindcss,
  SiTauri, SiTypescript, SiFlutter, SiMongodb, SiExpress, SiVercel, SiVite, SiVitest, SiWebrtc, SiCloudflare, SiSocketdotio,
} from "react-icons/si";
import { TbBucket, TbBroadcast, TbPlugConnected } from "react-icons/tb";

const icons: Record<string, IconType> = {
  "TypeScript": SiTypescript,
  "Next.js": SiNextdotjs,
  "React": SiReact,
  "Tailwind CSS": SiTailwindcss,
  "Framer Motion": SiFramer,
  "Radix / shadcn": SiRadixui,
  "Vite": SiVite,
  "Node.js": SiNodedotjs,
  "Go": SiGo,
  "Rust": SiRust,
  "Python": SiPython,
  "FastAPI": SiFastapi,
  "WebSockets": SiSocketdotio,
  "WebRTC": SiWebrtc,
  "HLS": TbBroadcast,
  "Kafka": SiApachekafka,
  "Spark Streaming": SiApachespark,
  "PostgreSQL": SiPostgresql,
  "Drizzle ORM": SiDrizzle,
  "Supabase": SiSupabase,
  "Redis": SiRedis,
  "Object Storage": TbBucket,
  "LLM APIs": SiOpenai,
  "LangChain & RAG": SiLangchain,
  "Tool calling & MCP": TbPlugConnected,
  "PyTorch": SiPytorch,
  "Hugging Face": SiHuggingface,
  "Tauri 2": SiTauri,
  "Flutter": SiFlutter,
  "Docker": SiDocker,
  "Auth & RBAC": SiJsonwebtokens,
  "Stripe": SiStripe,
  "Vitest": SiVitest,
  "Vercel & Cloudflare": SiVercel,
  "Claude": SiAnthropic,
  "Cloudflare": SiCloudflare,
  // Short aliases used by experience entries
  "LangChain": SiLangchain,
  "OpenAI": SiOpenai,
  "Express": SiExpress,
  "MongoDB": SiMongodb,
};

export function TechIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name];
  return Icon ? <Icon className={className} aria-hidden /> : null;
}

export const marqueeIcons: { name: string; Icon: IconType }[] = [
  "TypeScript", "Next.js", "React", "Rust", "Go", "Python", "PostgreSQL", "Redis", "Kafka",
  "Tauri 2", "Docker", "WebRTC", "PyTorch", "Tailwind CSS", "Supabase", "Drizzle ORM", "FastAPI",
  "LangChain & RAG", "Stripe", "Hugging Face",
].map((name) => ({ name: name.replace(" & RAG", "").replace(" ORM", "").replace(" 2", ""), Icon: icons[name] }));
