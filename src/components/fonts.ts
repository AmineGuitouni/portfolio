import { Fraunces } from "next/font/google";

/** The serif used for italic accents, shared by the homepage and the case studies. */
export const fraunces = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], axes: ["SOFT", "opsz"], variable: "--d5-serif" });
