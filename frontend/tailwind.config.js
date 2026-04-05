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
          950: '#090a0d',
          900: '#17191e',
          800: '#242830',
        },
        gunmetal: {
          base: '#090a0d',
          surface: '#14161b',
          elevated: '#1e2128',
          950: '#090a0d',
          900: '#14161b',
          800: '#1e2128',
          700: '#2b3039',
        },
        steel: {
          text: '#737882',
          light: '#4b515c',
          700: '#2d3139',
          500: '#464c58',
          300: '#8a909b',
          200: '#c2c7cf',
          100: '#e7eaef',
        },
        signal: {
          500: '#ff6a1a',
          400: '#ff7f33',
          300: '#ffa46b',
          dim: 'rgba(255, 106, 26, 0.15)',
        },
        surface: {
          50: '#12141a',
          100: '#1a1d24',
        },
        ink: {
          title: '#ffffff',
          900: '#f4f5f7',
          700: '#d8dbe0',
          500: '#9aa0aa',
        },
      },
      fontFamily: {
        sans: [
          'Segoe UI Variable Text',
          'Segoe UI Variable',
          'Aptos',
          'Segoe UI',
          'PingFang SC',
          'Hiragino Sans GB',
          'DengXian',
          'Microsoft YaHei UI',
          'Microsoft YaHei',
          'Noto Sans SC',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ],
        display: [
          'Segoe UI Variable Display',
          'Aptos Display',
          'Segoe UI Variable',
          'PingFang SC',
          'Hiragino Sans GB',
          'DengXian',
          'Microsoft YaHei UI',
          'Microsoft YaHei',
          'Noto Sans SC',
          'DIN Alternate',
          'DIN Condensed',
          'Aptos',
          'Segoe UI',
          'sans-serif'
        ],
        mono: ['Cascadia Mono', 'Consolas', 'JetBrains Mono', 'Courier New', 'monospace'],
      },
      borderRadius: {
        machined: '2px',
      },
      letterSpacing: {
        'widest-xl': '0.25em',
      },
      boxShadow: {
        soft: '0 0 0 1px rgba(138, 145, 158, 0.18)',
        lift: '6px 6px 0 0 rgba(15, 17, 21, 0.72)',
        hard: '4px 4px 0 0 rgba(15, 17, 21, 0.8)',
        glow: '0 0 0 1px rgba(255, 87, 34, 0.2)',
      },
      transitionTimingFunction: {
        mechanical: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scan-fill': {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scan-fill': 'scan-fill 6.2s linear forwards',
      },
    },
  },
  plugins: [],
}
