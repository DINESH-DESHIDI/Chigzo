/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chigzo: {
          primary: '#C9165B',
          hover: '#B0134F',
          dark: '#8C0E3E',
          light: '#FFF0F5',
          soft: '#FCE7F3',
          surface: '#FFFFFF',
          bg: '#F7F8FA',
          text: '#20232B',
          muted: '#64748B',
          border: '#E5E7EB',
          borderSubtle: '#F1F5F9',
          success: '#16A36A',
          warning: '#D97706',
          danger: '#DC3545',
          info: '#2563EB',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        card: '0 2px 6px -1px rgba(0, 0, 0, 0.05), 0 1px 4px -2px rgba(0, 0, 0, 0.05)',
        elevated: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        modal: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        pinkGlow: '0 4px 14px 0 rgba(201, 22, 91, 0.25)',
      },
      borderRadius: {
        card: '12px',
      }
    },
  },
  plugins: [],
}
