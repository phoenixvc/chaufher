import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  // Base styles
  [
    'inline-flex items-center justify-center gap-2',
    'font-poppins font-semibold',
    'rounded-md',
    'transition-all duration-200 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-magenta-500',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:scale-[0.98]',
  ],
  {
    variants: {
      variant: {
        // Primary - Gradient background
        primary: [
          'bg-gradient-primary text-white',
          'shadow-magenta',
          'hover:shadow-magenta-lg hover:-translate-y-0.5',
        ],
        // Secondary - Outlined
        secondary: [
          'bg-white text-magenta-600',
          'border-2 border-magenta-500',
          'hover:bg-magenta-50 hover:border-magenta-600',
        ],
        // Ghost - No background
        ghost: [
          'bg-transparent text-gray-700',
          'hover:bg-gray-100 hover:text-gray-900',
        ],
        // Outline - Gray border
        outline: [
          'bg-white text-gray-700',
          'border border-gray-300',
          'hover:bg-gray-50 hover:border-gray-400',
        ],
        // Danger - Red
        danger: [
          'bg-error-500 text-white',
          'shadow-sm',
          'hover:bg-error-600',
        ],
        // Success - Green
        success: [
          'bg-success-500 text-white',
          'shadow-sm',
          'hover:bg-success-600',
        ],
        // Link - Text only
        link: [
          'bg-transparent text-magenta-600 underline-offset-4',
          'hover:text-magenta-700 hover:underline',
          'p-0 h-auto',
        ],
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-base',
        lg: 'h-13 px-8 text-lg',
        xl: 'h-14 px-10 text-lg',
        icon: 'h-10 w-10 p-0',
        'icon-sm': 'h-8 w-8 p-0',
        'icon-lg': 'h-12 w-12 p-0',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const isDisabled = disabled || loading;

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
