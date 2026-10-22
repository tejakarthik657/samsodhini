/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#FAF9F5',
          surface: '#FFFFFF',
          elevated: '#F4F3EE',
          subtle: '#EFECE6',
        },
        ink: {
          title: '#0F172A',
          body: '#334155',
          muted: '#64748B',
          subtle: '#94A3B8',
        },
        brand: {
          primary: '#1E3A8A',
          hover: '#172554',
          light: '#EFF6FF',
          gold: '#D97706',
          goldSoft: '#FEF3C7',
        },
        // Pastel Branch Palettes
        branch: {
          cse: {
            DEFAULT: '#2563EB',
            bg: '#EFF6FF',
            border: '#BFDBFE',
            text: '#1D4ED8',
          },
          csm: {
            DEFAULT: '#7C3AED',
            bg: '#F5F3FF',
            border: '#DDD6FE',
            text: '#6D28D9',
          },
          csd: {
            DEFAULT: '#0D9488',
            bg: '#F0FDFA',
            border: '#99F6E4',
            text: '#0F766E',
          },
          it: {
            DEFAULT: '#0284C7',
            bg: '#F0F9FF',
            border: '#BAE6FD',
            text: '#0369A1',
          },
          ece: {
            DEFAULT: '#EA580C',
            bg: '#FFF7ED',
            border: '#FFEDD5',
            text: '#C2410C',
          },
          eee: {
            DEFAULT: '#D97706',
            bg: '#FFFBEB',
            border: '#FDE68A',
            text: '#B45309',
          },
          mech: {
            DEFAULT: '#E11D48',
            bg: '#FFF1F2',
            border: '#FECDD3',
            text: '#BE123C',
          },
          civil: {
            DEFAULT: '#059669',
            bg: '#ECFDF5',
            border: '#A7F3D0',
            text: '#047857',
          },
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(15, 23, 42, 0.04)',
        'glass-hover': '0 16px 48px 0 rgba(15, 23, 42, 0.08)',
        'poster': '0 20px 50px -12px rgba(15, 23, 42, 0.25)',
        'glow-gold': '0 0 25px rgba(217, 119, 6, 0.25)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};
