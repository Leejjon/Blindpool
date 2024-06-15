import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        archivo: ["Archivo", "sans-serif"]
      }
    },
  },
  plugins: [],
} satisfies Config;
