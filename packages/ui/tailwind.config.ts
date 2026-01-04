import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1200px',
        '2xl': '1400px',
      },
    },
    extend: {
      // ============================================
      // COLORS
      // ============================================
      colors: {
        // Brand Colors
        magenta: {
          50: '#FDF2F8',
          100: '#FCE7F3',
          200: '#FBCFE8',
          300: '#F9A8D4',
          400: '#F472B6',
          500: '#E91E8C', // Primary brand
          600: '#DB2777',
          700: '#BE185D',
          800: '#9D174D',
          900: '#831843',
          950: '#500724',
        },
        purple: {
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#9333EA', // Secondary brand
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
          950: '#2E1065',
        },
        // Semantic Colors
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        info: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        // Gray Scale (custom)
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          950: '#030712',
        },
        // Ride Status Colors (aliases)
        status: {
          scheduled: '#9333EA',      // purple-500
          assigned: '#3B82F6',       // info-500
          'en-route': '#F59E0B',     // warning-500
          arrived: '#E91E8C',        // magenta-500
          'in-progress': '#3B82F6',  // info-500
          completed: '#22C55E',      // success-500
          cancelled: '#EF4444',      // error-500
        },
      },

      // ============================================
      // TYPOGRAPHY
      // ============================================
      fontFamily: {
        poppins: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
        inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],      // 10px
        xs: ['0.75rem', { lineHeight: '1rem' }],          // 12px
        sm: ['0.875rem', { lineHeight: '1.25rem' }],      // 14px
        base: ['1rem', { lineHeight: '1.5rem' }],         // 16px
        lg: ['1.125rem', { lineHeight: '1.75rem' }],      // 18px
        xl: ['1.25rem', { lineHeight: '1.75rem' }],       // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],        // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],   // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],     // 36px
        '5xl': ['3rem', { lineHeight: '1' }],             // 48px
        '6xl': ['3.75rem', { lineHeight: '1' }],          // 60px
      },

      // ============================================
      // SPACING
      // ============================================
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
        '42': '10.5rem',
        '46': '11.5rem',
        '50': '12.5rem',
      },

      // ============================================
      // BORDER RADIUS
      // ============================================
      borderRadius: {
        'none': '0',
        'sm': '0.25rem',    // 4px
        'DEFAULT': '0.5rem', // 8px
        'md': '0.5rem',     // 8px
        'lg': '0.75rem',    // 12px
        'xl': '1rem',       // 16px
        '2xl': '1.5rem',    // 24px
        '3xl': '2rem',      // 32px
        'full': '9999px',
      },

      // ============================================
      // SHADOWS
      // ============================================
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'none': 'none',
        // Brand shadows
        'magenta': '0 4px 14px 0 rgb(233 30 140 / 0.3)',
        'magenta-lg': '0 8px 25px 0 rgb(233 30 140 / 0.35)',
        'purple': '0 4px 14px 0 rgb(147 51 234 / 0.3)',
        'purple-lg': '0 8px 25px 0 rgb(147 51 234 / 0.35)',
        // Card shadows
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08)',
        'card-hover': '0 10px 30px -5px rgb(0 0 0 / 0.1)',
      },

      // ============================================
      // GRADIENTS
      // ============================================
      backgroundImage: {
        // Brand gradients
        'gradient-primary': 'linear-gradient(135deg, #E91E8C 0%, #9333EA 100%)',
        'gradient-primary-hover': 'linear-gradient(135deg, #DB2777 0%, #7C3AED 100%)',
        'gradient-soft': 'linear-gradient(135deg, #FDF2F8 0%, #FAF5FF 100%)',
        'gradient-dark': 'linear-gradient(135deg, #831843 0%, #4C1D95 100%)',
        'gradient-horizontal': 'linear-gradient(90deg, #E91E8C 0%, #9333EA 100%)',
        'gradient-vertical': 'linear-gradient(180deg, #E91E8C 0%, #9333EA 100%)',
        // Overlay gradients
        'gradient-overlay': 'linear-gradient(135deg, rgba(233, 30, 140, 0.9) 0%, rgba(147, 51, 234, 0.9) 100%)',
        'gradient-overlay-dark': 'linear-gradient(135deg, rgba(131, 24, 67, 0.95) 0%, rgba(76, 29, 149, 0.95) 100%)',
        // Status gradients (for cards/headers)
        'gradient-success': 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
        'gradient-warning': 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        'gradient-error': 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
        'gradient-info': 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      },

      // ============================================
      // ANIMATIONS
      // ============================================
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'fade-in-up': 'fadeInUp 0.3s ease-out',
        'fade-in-down': 'fadeInDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 0.5s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },

      // ============================================
      // TRANSITIONS
      // ============================================
      transitionDuration: {
        '0': '0ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
      },
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      // ============================================
      // Z-INDEX
      // ============================================
      zIndex: {
        '0': '0',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        'dropdown': '100',
        'sticky': '200',
        'fixed': '300',
        'modal-backdrop': '400',
        'modal': '500',
        'popover': '600',
        'tooltip': '700',
        'toast': '800',
      },

      // ============================================
      // ASPECT RATIOS
      // ============================================
      aspectRatio: {
        'auto': 'auto',
        'square': '1 / 1',
        'video': '16 / 9',
        'portrait': '3 / 4',
        'landscape': '4 / 3',
      },
    },
  },
  plugins: [
    // Custom plugin for brand utilities
    function({ addUtilities, addComponents, theme }: any) {
      // Text gradient utility
      addUtilities({
        '.text-gradient': {
          'background': theme('backgroundImage.gradient-primary'),
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.text-gradient-dark': {
          'background': theme('backgroundImage.gradient-dark'),
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
      });

      // Focus ring utilities
      addUtilities({
        '.focus-ring': {
          '&:focus': {
            'outline': 'none',
            'box-shadow': `0 0 0 2px ${theme('colors.white')}, 0 0 0 4px ${theme('colors.magenta.500')}`,
          },
        },
        '.focus-ring-inset': {
          '&:focus': {
            'outline': 'none',
            'box-shadow': `inset 0 0 0 2px ${theme('colors.magenta.500')}`,
          },
        },
      });

      // Scrollbar utilities
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            'display': 'none',
          },
        },
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          '&::-webkit-scrollbar': {
            'width': '8px',
            'height': '8px',
          },
          '&::-webkit-scrollbar-track': {
            'background': theme('colors.gray.100'),
          },
          '&::-webkit-scrollbar-thumb': {
            'background': theme('colors.gray.300'),
            'border-radius': '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            'background': theme('colors.gray.400'),
          },
        },
      });

      // Glass morphism
      addUtilities({
        '.glass': {
          'background': 'rgba(255, 255, 255, 0.8)',
          'backdrop-filter': 'blur(10px)',
          '-webkit-backdrop-filter': 'blur(10px)',
        },
        '.glass-dark': {
          'background': 'rgba(0, 0, 0, 0.5)',
          'backdrop-filter': 'blur(10px)',
          '-webkit-backdrop-filter': 'blur(10px)',
        },
      });

      // Badge components
      addComponents({
        '.badge': {
          'display': 'inline-flex',
          'align-items': 'center',
          'padding': `${theme('spacing.1')} ${theme('spacing.3')}`,
          'font-family': theme('fontFamily.inter'),
          'font-size': theme('fontSize.xs')[0],
          'font-weight': theme('fontWeight.semibold'),
          'border-radius': theme('borderRadius.full'),
        },
        '.badge-scheduled': {
          'background': theme('colors.purple.50'),
          'color': theme('colors.purple.700'),
          'border': `1px solid ${theme('colors.purple.200')}`,
        },
        '.badge-assigned': {
          'background': theme('colors.info.50'),
          'color': theme('colors.info.700'),
          'border': `1px solid ${theme('colors.info.200')}`,
        },
        '.badge-en-route': {
          'background': theme('colors.warning.50'),
          'color': theme('colors.warning.700'),
          'border': `1px solid ${theme('colors.warning.200')}`,
        },
        '.badge-arrived': {
          'background': theme('colors.magenta.50'),
          'color': theme('colors.magenta.700'),
          'border': `1px solid ${theme('colors.magenta.200')}`,
        },
        '.badge-in-progress': {
          'background': theme('colors.info.50'),
          'color': theme('colors.info.700'),
          'border': `1px solid ${theme('colors.info.200')}`,
        },
        '.badge-completed': {
          'background': theme('colors.success.50'),
          'color': theme('colors.success.700'),
          'border': `1px solid ${theme('colors.success.200')}`,
        },
        '.badge-cancelled': {
          'background': theme('colors.error.50'),
          'color': theme('colors.error.700'),
          'border': `1px solid ${theme('colors.error.200')}`,
        },
        '.badge-verified': {
          'background': theme('colors.success.50'),
          'color': theme('colors.success.700'),
          'border': `1px solid ${theme('colors.success.200')}`,
        },
        '.badge-pending': {
          'background': theme('colors.warning.50'),
          'color': theme('colors.warning.700'),
          'border': `1px solid ${theme('colors.warning.200')}`,
        },
      });
    },
  ],
};

export default config;
