import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation:{
        "loop-scroll-left":"loop-scroll-left 45s infinite linear",
      },
      keyframes:{
        "loop-scroll-left": {
          from:{transform:"translateX(0)"},
          to:{transform:"translateX(-100%)"}
        },
      },
      colors: {
        "c-white-100": "#fafafa",
        "c-white-500": "#ecebea",
        "c-gray-100": "#242424",
      },
    },
  },
  plugins: [],
} satisfies Config;
