/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // 专业商务风格配色方案
        primary: '#1E40AF', // 更深邃的专业蓝色作为主色调
        secondary: '#334155', // 更稳重的中性深灰作为辅助色
        accent: '#0284C7', // 专业蓝色强调色
        success: '#059669',
        warning: '#D97706',
        danger: '#DC2626',
        info: '#475569',
        dark: '#0F172A',
        light: '#F8FAFC',
        // 渐变配色
        'gradient-start': '#1E40AF',
        'gradient-end': '#0284C7',
        // 状态颜色
        'hover-bg': 'rgba(30, 64, 175, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 6px 16px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 12px 24px rgba(0, 0, 0, 0.15)',
        'btn': '0 3px 6px rgba(30, 64, 175, 0.15)',
        'elevated': '0 10px 25px rgba(0, 0, 0, 0.1)',
        'dropdown': '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      transitionTimingFunction: {
        'business': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '300': '300ms',
        '500': '500ms',
      },
    },
  },
  plugins: [],
}