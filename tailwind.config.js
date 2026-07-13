/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        soc: {
          bg: '#0a0e14',
          panel: '#0d1117',
          card: '#11161f',
          border: '#1c2333',
          'border-light': '#2a3344',
          muted: '#6b7689',
          text: '#c9d1d9',
          bright: '#e6edf3',
        },
        accent: {
          cyan: '#22d3ee',
          'cyan-dim': '#0e7490',
          green: '#22c55e',
          'green-dim': '#15803d',
          amber: '#f59e0b',
          'amber-dim': '#b45309',
          red: '#ef4444',
          'red-dim': '#991b1b',
          blue: '#3b82f6',
        },
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(34, 211, 238, 0.15)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.15)',
        'glow-amber': '0 0 20px rgba(245, 158, 11, 0.15)',
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.15)',
        panel: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 0 0 1px rgba(255,255,255,0.03)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 4s linear infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'blink': 'blink 1.5s steps(2) infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
      },
    },
  },
  plugins: [],
};
