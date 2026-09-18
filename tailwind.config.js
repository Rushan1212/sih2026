/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic Showcase Tokens (Data signals, strata layers)
        void: 'var(--color-void)',
        page: 'var(--color-bg)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          sub: 'var(--color-surface-sub)',
        },
        line: 'var(--color-line)',
        textMain: 'var(--color-text)',
        textMuted: 'var(--color-text-muted)',
        accent: {
          DEFAULT: 'var(--color-accent)',
          soft: 'var(--color-accent-soft)',
        },
        verified: 'var(--color-verified)',
        risk: 'var(--color-risk)',

        // Backwards-compatibility for ExploreDashboard & PWA views
        coal: '#070708',
        graphite: '#16181c',
        amber: '#f5a524',
        teal: '#2fbf71',
        slate: '#24272d',
        offwhite: '#edeef0',
        dim: '#8b9099',
      },
      fontFamily: {
        display: ['"Archivo"', 'sans-serif'],
        sans: ['"Inter Tight"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      lineHeight: {
        'tight-display': '0.92',
        'heading': '1.05',
      },
      letterSpacing: {
        'tight-display': '-0.04em',
        'technical': '0.08em',
      },
      borderRadius: {
        'strata': '6px',
        'card': '8px',
      },
      boxShadow: {
        'amber-glow': '0 0 35px rgba(245, 165, 36, 0.20)',
        'verified-glow': '0 0 35px rgba(47, 191, 113, 0.25)',
        'risk-glow': '0 0 35px rgba(224, 82, 63, 0.25)',
        'card-hover': '0 20px 60px rgba(0, 0, 0, 0.6)',
      },
    },
  },
  plugins: [],
}
