/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Surfaces & Backgrounds: #FFFFFF (Primary) & #F7F8FA (Secondary)
        ink: {
          950: '#FFFFFF', // Primary Background: Main bright / clean white canvas
          900: '#FFFFFF', // Pure crisp card surface
          850: '#F7F8FA', // Secondary Background: secondary sections, soft cards, filters, inputs
          800: '#EEF2F6', // Soft interactive surface / pill / chip
          750: '#E5E7EB', // Standard clean border (#E5E7EB)
          700: '#D1D5DB', // Distinct border
          600: '#9CA3AF', // Active / hover border
        },
        // Typography: Professional dark text (#1F2937 primary, #6B7280 secondary)
        mist: {
          50: '#111827',  // Deepest charcoal for large hero headings
          100: '#1F2937', // Primary Text: Headings, product names, important info, main nav
          200: '#374151', // Secondary headings
          300: '#4B5563', // Readable body text
          400: '#6B7280', // Secondary Text: Descriptions, supporting info, metadata, helper text
          500: '#9CA3AF', // Muted labels / captions / placeholders
          600: '#D1D5DB', // Subtle metadata
          700: '#E5E7EB', // Clean borders (#E5E7EB)
          800: '#F3F4F6', // Subtle divider lines
          900: '#F9FAFB', // Ultra-light surface
        },
        // Primary Brand Accent: #2874F0 (Primary buttons, active states, important highlights, links)
        spark: {
          50: '#EBF2FE',
          100: '#D6E5FD',
          200: '#B0CEFB',
          300: '#85B3F9',
          400: '#5294F5',
          500: '#2874F0', // Primary Brand Accent: Primary buttons, links, AI highlights, active states
          600: '#1E5BBF', // Hover state
          700: '#164391', // Pressed / active
          800: '#102F63',
        },
        // Secondary Accent: #FF3F6C (Wishlist/favorite actions, promotional highlights, small badges)
        signal: {
          50: '#FFF0F3',
          100: '#FFE2E8',
          200: '#FFB8C7',
          300: '#FF8DA5',
          400: '#FF3F6C', // Secondary Accent: wishlist, promotional highlights, badges
          500: '#FF3F6C', // Exact Secondary Accent
          600: '#E02653', // Hover
          700: '#B8183F',
        },
        // Warm Action Accent: #FF9900 (Deals, offers, discount indicators, promotional badges)
        deal: {
          50: '#FFF8E7',
          100: '#FFF0CC',
          200: '#FFE099',
          300: '#FFD066',
          400: '#FFA41C',
          500: '#FF9900', // Warm Action Accent: deals, discounts, ratings
          600: '#E68A00',
          700: '#CC7A00',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        editorial: ['"Syne"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 2px rgba(40, 116, 240, 0.18), 0 8px 24px -4px rgba(40, 116, 240, 0.2)',
        'glow-signal': '0 0 0 2px rgba(255, 63, 108, 0.18), 0 8px 24px -4px rgba(255, 63, 108, 0.2)',
        'glow-deal': '0 0 0 2px rgba(255, 153, 0, 0.18), 0 8px 24px -4px rgba(255, 153, 0, 0.2)',
        luxury: '0 12px 32px -8px rgba(31, 41, 55, 0.08), 0 0 0 1px #E5E7EB',
        card: '0 2px 8px -2px rgba(31, 41, 55, 0.06), 0 0 0 1px #E5E7EB',
        'card-hover': '0 12px 28px -6px rgba(40, 116, 240, 0.12), 0 0 0 1px #2874F0',
      },
      borderRadius: {
        bubble: '1.75rem',
        luxury: '1.25rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.85' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
