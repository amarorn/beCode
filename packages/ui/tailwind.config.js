module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./docs/**/*.{md,mdx}"
  ],
  darkMode: 'class', // Ativa o dark mode baseado em classes CSS (ex: class="dark")
  theme: {
    extend: {
      colors: {
        // Tokens de Cores - Baseados nas necessidades de uma IDE
        // Brand
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // Primary brand color
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        // Surfaces & Backgrounds
        surface: {
          DEFAULT: '#ffffff',
          alt: '#f8fafc', // Sidebar, panels
          muted: '#f1f5f9', // Inactive tabs
          dark: '#0f172a', // Editor background dark
          'dark-alt': '#1e293b', // Sidebar dark
          'dark-muted': '#334155', // Inactive tabs dark
        },
        // Borders
        border: {
          DEFAULT: '#e2e8f0',
          dark: '#334155',
          focus: '#3b82f6', // Focus ring
        },
        // Text
        content: {
          DEFAULT: '#0f172a',
          muted: '#64748b',
          inverse: '#ffffff',
          dark: '#f8fafc',
          'dark-muted': '#94a3b8',
        },
        // Semantic states
        status: {
          info: '#3b82f6',
          success: '#22c55e',
          warning: '#eab308',
          error: '#ef4444',
        }
      },
      fontFamily: {
        // Fontes - Combinando UI e Código
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"Fira Code"', '"JetBrains Mono"', 'monospace'],
      },
      spacing: {
        // Escala refinada para UIs densas (IDE)
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
      },
      boxShadow: {
        'panel': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}