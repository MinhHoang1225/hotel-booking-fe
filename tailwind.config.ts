import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(214 18% 86%)",
        background: "hsl(210 24% 98%)",
        foreground: "hsl(220 24% 14%)",
        muted: "hsl(210 20% 94%)",
        primary: "hsl(199 82% 36%)",
        accent: "hsl(31 88% 54%)"
      }
    }
  },
  plugins: []
} satisfies Config;
