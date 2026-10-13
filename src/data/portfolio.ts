// Single source of truth for portfolio content.
// Stack + project facts were compiled from the GitHub repositories (manifests, READMEs, docs)
// so the homepage and the upcoming per-project pages render the same verified data.

export const profile = {
  name: "Mohamed Amine Guitouni",
  shortName: "Amine Guitouni",
  firstName: "Amine",
  lastName: "Guitouni",
  initials: "AG",
  role: "Full-Stack & Systems Engineer",
  headline: "I build products end to end — from the pixel to the packet.",
  intro:
    "Interfaces in React & Next.js, services in Go and Rust, data in PostgreSQL, and intelligence in Python. I design the system, write the code, and ship it to production.",
  manifesto:
    "Most developers pick a layer. I like owning the whole path — the interface a person touches, the API it calls, the queue it lands in, the database that remembers it, and the model that makes sense of it.",
  location: "Tunisia · Remote worldwide",
  timezone: "Africa/Tunis",
  available: true,
  email: "guitouni.medamine@gmail.com",
  photo: "/amine_pic.png",
  links: {
    github: "https://github.com/AmineGuitouni",
    linkedin: "https://www.linkedin.com/in/mohamed-amine-guitouni-44a400328/",
    cv: "https://drive.google.com/file/d/1lvfpmACQrBXOJn74oiX2xurdF196aI1n/view?usp=sharing",
    whatsapp: "https://wa.me/21656522039",
    mail: "https://mail.google.com/mail/?view=cm&fs=1&to=guitouni.medamine@gmail.com",
  },
};

export const stats = [
  { value: 1300, suffix: "+", label: "Commits across production repos" },
  { value: 35, suffix: "+", label: "Repositories built" },
  { value: 5, suffix: "", label: "Languages in production" },
  { value: 59, suffix: "M", label: "Chess positions searched / sec" },
];

// Share of code by bytes across own (non-fork) repositories on GitHub.
export const languages = [
  { name: "TypeScript", share: 84.9, color: "#3178C6" },
  { name: "Rust", share: 4.0, color: "#DEA584" },
  { name: "Python", share: 3.7, color: "#3572A5" },
  { name: "Go", share: 2.6, color: "#00ADD8" },
  { name: "SQL / PL-pgSQL", share: 1.4, color: "#336791" },
  { name: "Other", share: 3.4, color: "#8B8B8B" },
];

export type Tech = {
  name: string;
  /** Short, concrete note about how it's used */
  note: string;
  usedIn: string[];
};

export type StackGroup = {
  id: string;
  title: string;
  caption: string;
  items: Tech[];
};

export const stack: StackGroup[] = [
  {
    id: "interface",
    title: "Interface",
    caption: "Product UIs that feel fast and stay maintainable.",
    items: [
      { name: "TypeScript", note: "Default language, strict mode everywhere", usedIn: ["MegaTel", "Launderer", "MegaShop"] },
      { name: "Next.js", note: "App Router, RSC, Server Actions, i18n", usedIn: ["MegaTel", "Launderer", "MegaShop"] },
      { name: "React", note: "React 19 across web & desktop", usedIn: ["MegaTel", "MegaShop", "Chess Engine"] },
      { name: "Tailwind CSS", note: "v4 design tokens & theming", usedIn: ["Launderer", "MegaShop"] },
      { name: "Framer Motion", note: "Interaction & motion design", usedIn: ["MegaTel", "AI Platform"] },
      { name: "Radix / shadcn", note: "Accessible UI primitives", usedIn: ["Launderer", "MegaShop"] },
      { name: "Vite", note: "Desktop & SPA frontends", usedIn: ["MegaTel Desktop", "Chess Engine"] },
    ],
  },
  {
    id: "services",
    title: "Services",
    caption: "APIs and workers in the right language for the job.",
    items: [
      { name: "Node.js", note: "Express APIs with OpenAPI docs", usedIn: ["Launderer Remote"] },
      { name: "Go", note: "Gin API, media & AI handlers", usedIn: ["MegaTel"] },
      { name: "Rust", note: "Axum, Tokio, SQLx services", usedIn: ["MegaShop", "Launderer", "Chess Engine"] },
      { name: "Python", note: "FastAPI services & ML", usedIn: ["Vickers"] },
      { name: "FastAPI", note: "Model-serving & security APIs", usedIn: ["Vickers"] },
    ],
  },
  {
    id: "realtime",
    title: "Realtime",
    caption: "Live data, live media, no polling.",
    items: [
      { name: "WebSockets", note: "Authenticated fan-out servers", usedIn: ["MegaShop"] },
      { name: "WebRTC", note: "Pion (Go) & webrtc-rs streaming", usedIn: ["MegaTel"] },
      { name: "HLS", note: "Recording live streams to HLS", usedIn: ["MegaTel"] },
      { name: "Kafka", note: "Event-driven pipelines", usedIn: [] },
      { name: "Spark Streaming", note: "Structured streaming + NLP", usedIn: [] },
    ],
  },
  {
    id: "data",
    title: "Data",
    caption: "Schemas, migrations and caches that hold up in production.",
    items: [
      { name: "PostgreSQL", note: "Triggers, views, LISTEN/NOTIFY", usedIn: ["MegaShop", "Launderer", "MegaTel"] },
      { name: "Drizzle ORM", note: "Typed schemas & migrations", usedIn: ["Launderer", "MegaShop"] },
      { name: "Supabase", note: "Auth, storage & Postgres", usedIn: ["MegaTel", "AI Platform"] },
      { name: "Redis", note: "Access caches with DB fallback", usedIn: ["MegaShop", "Launderer"] },
      { name: "Object Storage", note: "S3 · Cloudflare R2 · RustFS", usedIn: ["MegaShop", "Launderer"] },
    ],
  },
  {
    id: "intelligence",
    title: "Intelligence",
    caption: "AI that does a job, not a demo.",
    items: [
      { name: "LLM APIs", note: "OpenAI · Claude · Gemini · Cohere", usedIn: ["MegaTel", "Launderer", "AI Platform"] },
      { name: "LangChain & RAG", note: "Embeddings, retrieval, semantic search", usedIn: ["MegaTel", "AI Platform"] },
      { name: "Tool calling & MCP", note: "Agents that act on real data", usedIn: ["Launderer", "AI Console"] },
      { name: "PyTorch", note: "U-Net vision models", usedIn: ["Vickers"] },
      { name: "Hugging Face", note: "Transformer inference (RoBERTa)", usedIn: [] },
    ],
  },
  {
    id: "native",
    title: "Native & Ops",
    caption: "Desktop apps, containers and the pipeline to ship them.",
    items: [
      { name: "Tauri 2", note: "Rust desktop apps with auto-update", usedIn: ["MegaTel Desktop", "Chess Engine"] },
      { name: "Flutter", note: "Touchscreen kiosk apps on embedded Linux", usedIn: ["Launderer"] },
      { name: "Docker", note: "Compose stacks & sandboxed agents", usedIn: [] },
      { name: "Auth & RBAC", note: "Auth.js, JWT, multi-tenant roles", usedIn: ["Launderer", "MegaShop"] },
      { name: "Stripe", note: "Checkout & payments", usedIn: ["MegaShop"] },
      { name: "Vitest", note: "Unit & integration suites", usedIn: ["Launderer", "MegaShop", "MegaTel"] },
      { name: "Vercel & Cloudflare", note: "Edge deploys & R2 storage", usedIn: ["MegaShop", "MegaTel"] },
    ],
  },
];

export type Project = {
  slug: string;
  name: string;
  kind: string;
  year: string;
  tagline: string;
  summary: string;
  role: string;
  highlights: string[];
  metrics: { value: string; label: string }[];
  stack: string[];
  links: { label: string; href: string }[];
  /** Collaborators to credit on the card */
  credits?: string;
  accent: string;
  visibility: "public" | "private";
};

export const projects: Project[] = [
  {
    slug: "megatel",
    name: "MegaTel",
    kind: "Workforce platform",
    year: "2025 — 2026",
    tagline: "One platform, three apps, for a distributed interviewer workforce.",
    summary:
      "An operating system for a call-center network: a Next.js web platform for operations, a Rust/Tauri desktop agent for workers, and a Go media backend that streams live screen and audio for supervision.",
    role: "Architecture · Full-stack · Desktop",
    highlights: [
      "Tauri desktop agent captures screen (H.264) and audio (Opus) and streams it over WebRTC",
      "Go + Pion backend ingests live streams and records them to HLS",
      "CATI interview runner, scheduling, chat, documents and performance billing",
      "RAG assistant over company documents with embeddings and streaming answers",
    ],
    metrics: [
      { value: "3", label: "deployable apps" },
      { value: "680+", label: "commits on web" },
      { value: "WebRTC", label: "→ HLS pipeline" },
    ],
    stack: ["Next.js", "TypeScript", "Supabase", "Go", "Pion WebRTC", "Rust", "Tauri 2", "LangChain"],
    links: [{ label: "mega-tel.de", href: "https://mega-tel.de" }],
    accent: "#FF5B1F",
    visibility: "private",
  },
  {
    slug: "launderer",
    name: "Launderer",
    kind: "IoT + SaaS platform",
    year: "2026",
    tagline: "Laundromat automation, from the kiosk to the cloud.",
    summary:
      "An end-to-end platform for laundromat chains: touchscreen kiosks that top up RFID cards with cash or card payments, an edge backend that drives the machines, and a multi-tenant cloud SaaS where owners run stores, machines, cash collection and analytics.",
    role: "Product engineering · Architecture",
    highlights: [
      "Flutter kiosks with RFID readers, bill validators, card dispensers and receipt printers",
      "Edge backend controls machines over ESP32, with Postgres replication between kiosks for failover",
      "Kiosks keep working offline and sync transaction batches and telemetry to the cloud",
      "Multi-tenant SaaS with analytics, cash collection, firmware management and an AI assistant",
    ],
    metrics: [
      { value: "3", label: "tiers: kiosk, edge, cloud" },
      { value: "185+", label: "commits on the SaaS" },
      { value: "TS + Rust", label: "web & worker" },
    ],
    stack: ["Next.js 16", "Flutter", "PostgreSQL", "Drizzle", "Express", "ESP32", "Rust", "Redis"],
    links: [],
    accent: "#2E6BFF",
    visibility: "private",
  },
  {
    slug: "megashop",
    name: "MegaShop",
    kind: "Commerce platform",
    year: "2026",
    tagline: "Storefront, back-office and a Rust realtime server.",
    summary:
      "Commerce split into three independently deployable apps: a Stripe-powered storefront, a clean-architecture admin dashboard, and a read-only Rust WebSocket server that fans out support chat straight from Postgres.",
    role: "Architecture · Full-stack · Rust",
    highlights: [
      "Postgres triggers → LISTEN/NOTIFY → Axum WebSockets, zero polling",
      "Domain / application / infrastructure layers enforced with ESLint",
      "Fixed-role RBAC with a Redis access cache and 150 ms DB fallback",
      "Short-lived JWTs authenticated in the first frame, never in URLs",
    ],
    metrics: [
      { value: "3", label: "independent apps" },
      { value: "0", label: "polling loops" },
      { value: "150ms", label: "cache fail-safe" },
    ],
    stack: ["Next.js", "Stripe", "Drizzle", "PostgreSQL", "Redis", "Rust", "Axum", "Cloudflare R2"],
    links: [{ label: "Live shop", href: "https://shop.mega-tel.de/" }],
    accent: "#00B37E",
    visibility: "private",
  },
  {
    slug: "rust-chess-engine",
    name: "Rust Chess Engine",
    kind: "Engine · Desktop app",
    year: "2026",
    tagline: "59 million positions per second, written from scratch.",
    summary:
      "A chess engine and desktop app built to learn Rust properly: legal move generation verified by perft, alpha-beta search with a transposition table, and a Tauri + Preact interface to play against it.",
    role: "Solo · Rust · Algorithms",
    highlights: [
      "Iterative-deepening negamax with alpha-beta and quiescence search",
      "Zobrist hashing with an aging, depth-aware transposition table",
      "Pins, checks and evasion masks computed once per node with bitmasks",
      "Packed 16-bit moves and allocation-free attack detection",
    ],
    metrics: [
      { value: "59M", label: "nodes / second" },
      { value: "4.86M", label: "perft(5) nodes in 82 ms" },
      { value: "1–6", label: "engine depth" },
    ],
    stack: ["Rust", "Tauri", "Preact", "TypeScript", "Vite"],
    links: [{ label: "GitHub", href: "https://github.com/AmineGuitouni/Rust-Chess-Engine" }],
    accent: "#E8B04A",
    visibility: "public",
  },
  {
    slug: "ai-business-platform",
    name: "AI Business Platform",
    kind: "Final-year project · Best PFE award",
    year: "2025",
    tagline: "Ranked 1st at ISIMA — an AI agent that staffs projects from CVs.",
    summary:
      "A multi-tenant business platform with a voice-enabled, tool-calling AI agent. Managers describe what they need in plain language; the agent creates projects, generates tasks, parses every CV into skills and assigns the best-matched people — with RBAC, tenant isolation and audit logs underneath.",
    role: "Final-year project · with Oumaima Fdhila · Digi Growing",
    highlights: [
      "Ranked 1st and received the Best PFE Project Award at ISIMA",
      "Tool-calling agent for projects, tasks, users, groups and email — with voice chat",
      "PDF CV parsing, skill extraction and employee–task matching with confidence scores",
      "RBAC, tenant isolation, audit logs and Redis caching",
    ],
    metrics: [
      { value: "#1", label: "Best PFE Project · ISIMA" },
      { value: "13", label: "agent tools" },
      { value: "RAG", label: "semantic search" },
    ],
    stack: ["Next.js", "Supabase", "PostgreSQL", "Redis", "LangChain", "OpenAI", "Cohere", "NextAuth"],
    credits: "Built with Oumaima Fdhila",
    links: [
      { label: "Demo video", href: "https://www.youtube.com/watch?v=3Na58H14JbM" },
      { label: "Presentation", href: "https://drive.google.com/file/d/1zRpL3h7grnZPnMRVoKZ_qFlwwRivlQux/view?usp=sharing" },
      { label: "Report", href: "https://drive.google.com/file/d/1QnWoHG6c-t2V0rIHA1W9vnOsbIBcZXdM/view" },
    ],
    accent: "#7DD5DE",
    visibility: "public",
  },
  {
    slug: "vickers-hardness",
    name: "Vickers Vision",
    kind: "Computer vision",
    year: "2024",
    tagline: "Measuring metal hardness from a microscope image.",
    summary:
      "A U-Net model that finds the corners of Vickers indentations in microscope images to automate hardness measurement — with a custom labelling tool and a FastAPI inference endpoint.",
    role: "ML engineering",
    highlights: [
      "U-Net trained on a hand-labelled dataset",
      "Labelling and visual verification tools",
      "FastAPI endpoint for integration in lab software",
    ],
    metrics: [
      { value: "U-Net", label: "architecture" },
      { value: "4", label: "corners per indent" },
      { value: "API", label: "inference" },
    ],
    stack: ["PyTorch", "OpenCV", "FastAPI", "Python"],
    links: [{ label: "GitHub", href: "https://github.com/AmineGuitouni/Vickers-hardness-measurement" }],
    accent: "#B8FF3D",
    visibility: "public",
  },
];


export const moreWork = [
  { name: "AI Chat Console", note: "Multi-provider terminal chat with tool calling & MCP", href: "https://github.com/AmineGuitouni/console-ai-chat" },
  { name: "Courima", note: "E-learning platform with an AI virtual teacher", href: "https://courima.guitouni-amine.me" },
  { name: "Wordle Clone", note: "Daily challenges & leaderboards", href: "https://wordle.guitouni-amine.me/" },
  { name: "Request Logger Proxy", note: "Node proxy that records HTTP traffic", href: "https://github.com/AmineGuitouni/node-request-logger-proxy" },
];

// Facts below are summarised from signed letters. The letters themselves stay private and are shared on request.
export const recognition = {
  title: "Best final-year project · Licence 2024/2025",
  issuer: "ISIMA — Higher Institute of Computer Science of Mahdia, University of Monastir",
  project: "AI-Powered Business Management Platform (AI-BMP)",
  team: "with Oumaima Fdhila",
  date: "July 2025",
  summary:
    "Designated the best final-year project of the Licence session, for its technological relevance, methodological rigour and the innovation of its AI applied to business management.",
  signedBy: "Signed by the Institute’s Director · 22 July 2025",
  projectSlug: "ai-business-platform",
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  /** What Amine worked on */
  work: string;
  /** English summary of the signed letter */
  letter: string;
  signedBy: string;
  stack: string[];
  projectSlug?: string;
};

export const experience: Experience[] = [
  {
    id: "digi-growing",
    company: "Digi Growing",
    role: "AI / Full-stack developer intern",
    period: "Feb – Jun 2025",
    location: "Mahdia, Tunisia",
    work: "Built an internal multi-tenant SaaS platform — the AI Business Platform, which became the award-winning final-year project.",
    letter:
      "Developed an internal SaaS platform. Commended for seriousness, motivation and professional skills, and for adapting quickly to every task.",
    signedBy: "Signed by the CEO · 2 June 2025",
    stack: ["Next.js", "Supabase", "LangChain", "OpenAI", "Cohere", "Redis"],
    projectSlug: "ai-business-platform",
  },
  {
    id: "mega-tel",
    company: "Mega Tel Hi Tech",
    role: "Full-stack / AI developer intern",
    period: "Jan – Sep 2024",
    location: "Sofia, Bulgaria · remote",
    work: "Worked on the MegaTel employee productivity platform in the IT department, including an internal RAG assistant that answers questions from company documents with sources.",
    letter:
      "Contributed significantly to several projects using Scrum, building front-end and back-end with Next.js, React, Node.js, Express, PostgreSQL (Supabase), MongoDB and Tailwind CSS. Commended for engagement, adaptability, professionalism and autonomy.",
    signedBy: "Signed by the HR manager · 1 October 2024",
    stack: ["Next.js", "React", "Node.js", "Express", "Supabase", "MongoDB"],
    projectSlug: "megatel",
  },
];
