/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Background tokens (from mockups)
        bg: {
          primary: 'var(--color-background-primary)',
          secondary: 'var(--color-background-secondary)',
          tertiary: 'var(--color-background-tertiary)',
          info: 'var(--color-background-info)',
          danger: 'var(--color-background-danger)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
          info: 'var(--color-text-info)',
          danger: 'var(--color-text-danger)',
        },
        border: {
          primary: 'var(--color-border-primary)',
          secondary: 'var(--color-border-secondary)',
          tertiary: 'var(--color-border-tertiary)',
          info: 'var(--color-border-info)',
          danger: 'var(--color-border-danger)',
        },
        // Accent (purple from mockups)
        accent: {
          50: '#EEEDFE',
          200: '#CECBF6',
          300: '#AFA9EC',
          500: '#534AB7',
          900: '#26215C',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
