/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coal: '#0D0D0D',
        graphite: '#1A1A2E',
        amber: '#F5A623',
        teal: '#00C9A7',
        slate: '#2D3561',
        offwhite: '#E8E6E1',
        dim: '#7A7A8C',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        'card': '8px',
      },
      boxShadow: {
        'amber-glow': '0 0 40px rgba(245, 166, 35, 0.15)',
        'monitor-glow': '0 0 60px rgba(245, 166, 35, 0.15)',
        'card-hover': '0 20px 60px rgba(245, 166, 35, 0.08)',
      },
    },
  },
  plugins: [],
}
