import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Design System Colors from Figma
        background: '#f8f9fa',
        sidebar: '#1e293b',
        'sidebar-hover': '#334155',
        'sidebar-active': '#e2e8f0',
        primary: '#0f172a',
        secondary: '#64748b',
        border: '#e2e8f0',
        accent: '#10b981',
        'accent-hover': '#059669',
        danger: '#ef4444',
        'danger-hover': '#dc2626',
        card: '#ffffff',
        input: '#ffffff',
        ring: '#10b981',

        // Budget Theme Colors
        'budget-green': '#277C78',
        'budget-cyan': '#82C9D7',
        'budget-yellow': '#F2CDAC',
        'budget-navy-grey': '#626070',
        'budget-purple': '#826CB0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'page-title': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'section-title': ['18px', { lineHeight: '28px', fontWeight: '600' }],
        'body': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'card-value': ['20px', { lineHeight: '28px', fontWeight: '700' }],
        'small': ['12px', { lineHeight: '16px', fontWeight: '400' }],
      },
      borderRadius: {
        card: '8px',
        avatar: '50%',
      },
      spacing: {
        card: '16px',
        sidebar: '240px',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },
      transitionDuration: {
        '200': '200ms',
      },
    },
  },
  plugins: [],
}

export default config
