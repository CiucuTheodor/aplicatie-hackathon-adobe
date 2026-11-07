/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#070D1A",
          sidebar: "#0D1728",
          nav: "#101A2B",
          card: "#111E30",
          cardHover: "#15243a",
          border: "#26364B",
          emerald: "#19D9A0",
          blue: "#2185F5",
          orange: "#F59E35",
          gray: "#8995A7",
          text: "#F3F6FA",
          muted: "#A0AEC0",
          darkMuted: "#4B5A70"
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ]
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.4), 0 0 1px 1px rgba(38, 54, 75, 0.5)',
        'emerald-glow': '0 0 15px rgba(25, 217, 160, 0.25)',
        'blue-glow': '0 0 15px rgba(33, 133, 245, 0.25)',
      }
    },
  },
  plugins: [],
}
