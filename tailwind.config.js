/** @type {import('tailwindcss').Config} */

// Bold colour-block system. `teal` / `blue` / `indigo` / `sky` / `cyan` all resolve to the cobalt
// scale and `saffron` / `purple` / `violet` / `fuchsia` to marigold, so every existing utility in the
// organizer dashboard and modals lands on the new brand without a rewrite.
const cobalt = {
  50: '#F1F2FF',
  100: '#E1E4FF',
  200: '#C3CAFF',
  300: '#98A5FF',
  400: '#6577FF',
  500: '#3A4BFF',
  600: '#2F3BE0',
  700: '#2A2A94',
  800: '#1F1B63',
  900: '#15123F',
  950: '#0D0B2B',
};

const marigold = {
  50: '#FFF8E1',
  100: '#FFEDB3',
  200: '#FFE082',
  300: '#FFD04D',
  400: '#FFBF1F',
  500: '#FFAB00',
  600: '#E69500',
  700: '#B87500',
  800: '#8A5800',
  900: '#5C3B00',
  950: '#3A2400',
};

const coral = {
  50: '#FFF0EE',
  100: '#FFD9D5',
  200: '#FFB5AD',
  300: '#FF8E82',
  400: '#FF7466',
  500: '#FF5A4D',
  600: '#E8412F',
  700: '#B82E20',
};

const mint = {
  50: '#EAFDF5',
  100: '#C9F8E3',
  200: '#9CF0CD',
  300: '#6BE5B4',
  400: '#3FD79A',
  500: '#1FBF80',
  600: '#139A65',
};

const lilac = {
  50: '#F4F1FF',
  100: '#E9E3FF',
  200: '#D9D2FF',
  300: '#BFB3FF',
  400: '#A292FF',
};

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          50: '#F7F6FC',
          100: '#EEECF7',
          200: '#DEDBEE',
          300: '#C2BEDA',
          400: '#9792B8',
          500: '#6F6A93',
          600: '#55507A',
          700: '#3D3963',
          800: '#2A2650',
          900: '#1A1745',
          950: '#0F0D2E',
        },
        blue: cobalt,
        indigo: cobalt,
        sky: cobalt,
        cyan: cobalt,
        teal: cobalt,
        cobalt,
        purple: marigold,
        violet: marigold,
        fuchsia: marigold,
        saffron: marigold,
        marigold,
        coral,
        mint,
        lilac,
        paper: {
          DEFAULT: '#F7F5FF',
          raised: '#FFFFFF',
          sunk: '#EEECF7',
        },
        ink: {
          DEFAULT: '#15123F',
          deep: '#0D0B2B',
          title: '#15123F',
          body: '#3D3963',
          muted: '#6F6A93',
          subtle: '#9792B8',
        },
        canvas: { DEFAULT: '#F7F5FF', surface: '#FFFFFF', elevated: '#EEECF7', subtle: '#DEDBEE' },
        brand: { primary: '#15123F', hover: '#1F1B63', light: '#F1F2FF', gold: '#FFAB00', goldSoft: '#FFF8E1' },
        branch: {
          cse: { DEFAULT: '#3A4BFF', bg: '#F1F2FF', border: '#C3CAFF', text: '#2A2A94' },
          csm: { DEFAULT: '#FFAB00', bg: '#FFF8E1', border: '#FFE082', text: '#8A5800' },
          csd: { DEFAULT: '#3A4BFF', bg: '#F1F2FF', border: '#C3CAFF', text: '#2A2A94' },
          it: { DEFAULT: '#3A4BFF', bg: '#F1F2FF', border: '#C3CAFF', text: '#2A2A94' },
          ece: { DEFAULT: '#FFAB00', bg: '#FFF8E1', border: '#FFE082', text: '#8A5800' },
          eee: { DEFAULT: '#FFAB00', bg: '#FFF8E1', border: '#FFE082', text: '#8A5800' },
          mech: { DEFAULT: '#FF5A4D', bg: '#FFF0EE', border: '#FFB5AD', text: '#B82E20' },
          civil: { DEFAULT: '#1FBF80', bg: '#EAFDF5', border: '#9CF0CD', text: '#139A65' },
        },
      },
      fontFamily: {
        sans: ['Instrument Sans', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Syne', 'Instrument Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        glass: 'none',
        'glass-hover': '6px 6px 0 0 #15123F',
        poster: '8px 8px 0 0 #15123F',
        'glow-gold': '0 0 0 3px rgba(255, 171, 0, 0.35)',
        pop: '5px 5px 0 0 #15123F',
        'pop-sm': '3px 3px 0 0 #15123F',
        'pop-lg': '9px 9px 0 0 #15123F',
        'pop-gold': '5px 5px 0 0 #FFAB00',
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '22px',
        '4xl': '32px',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
        wiggle: 'wiggle 0.5s ease-in-out',
        'fade-in': 'fade-in 0.18s ease-out both',
        'scale-up': 'scale-up 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'slide-up': 'slide-up 0.22s ease-out both',
        marquee: 'marquee 40s linear infinite',
        flip: 'flip 0.35s ease-out',
        'marquee-rev': 'marquee-rev 48s linear infinite',
        'spin-slow': 'spin 28s linear infinite',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'scale-up': { from: { opacity: '0', transform: 'scale(0.94) translateY(10px)' }, to: { opacity: '1', transform: 'none' } },
        'slide-up': { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'none' } },
        flip: { '0%': { transform: 'rotateX(90deg)', opacity: '0' }, '100%': { transform: 'rotateX(0deg)', opacity: '1' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        'marquee-rev': { from: { transform: 'translateX(-50%)' }, to: { transform: 'translateX(0)' } },
        wiggle: {
          '0%, 100%': { transform: 'rotate(var(--r, 0deg))' },
          '30%': { transform: 'rotate(calc(var(--r, 0deg) - 5deg)) scale(1.05)' },
          '70%': { transform: 'rotate(calc(var(--r, 0deg) + 4deg)) scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};
