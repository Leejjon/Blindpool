import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      bpgreen: "#00cc47"
    },
    extend: {
      fontFamily: {
        archivo: ["Archivo", "sans-serif"]
      }
    },
  },
  plugins: [],
} satisfies Config;
