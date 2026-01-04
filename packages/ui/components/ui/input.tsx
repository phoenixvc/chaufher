import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle, Check, Eye, EyeOff } from 'lucide-react';
import { cn } from '../../lib/utils';

const inputVariants = cva(
  [
    'flex w-full',
    'font-inter text-base text-gray-900',
    'bg-white',
    'border rounded-md',
    'transition-all duration-200 ease-out',
    'placeholder:text-gray-400',
    'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60',
  ],
  {
    variants: {
      variant: {
        default: [
          'border-gray-300',
          'hover:border-gray-400',
          'focus:outline-none focus:border-magenta-500 focus:ring-2 focus:ring-magenta-500/10',
        ],
        error: [
          'border-error-500',
          'focus:outline-none focus:border-error-500 focus:ring-2 focus:ring-error-500/10',
        ],
        success: [
          'border-success-500',
          'focus:outline-none focus:border-success-500 focus:ring-2 focus:ring-success-500/10',
        ],
      },
      inputSize: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-4 text-base',
        lg: 'h-13 px-5 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'md',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  successMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      variant,
      inputSize,
      label,
      helperText,
      errorMessage,
      successMessage,
      leftIcon,
      rightIcon,
      showPasswordToggle,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const inputId = id || React.useId();

    // Determine variant based on messages
    const computedVariant = errorMessage
      ? 'error'
      : successMessage
      ? 'success'
      : variant;

    // Handle password visibility toggle
    const inputType =
      type === 'password' && showPasswordToggle
        ? showPassword
          ? 'text'
          : 'password'
        : type;

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            {label}
            {props.required && (
              <span className="ml-1 text-error-500">*</span>
            )}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            type={inputType}
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={cn(
              inputVariants({ variant: computedVariant, inputSize }),
              leftIcon && 'pl-10',
              (rightIcon || showPasswordToggle || errorMessage || successMessage) && 'pr-10',
              className
            )}
            aria-invalid={!!errorMessage}
            aria-describedby={
              errorMessage
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            {...props}
          />

          {/* Right side icons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {/* Status icons */}
            {errorMessage && !rightIcon && !showPasswordToggle && (
              <AlertCircle className="h-5 w-5 text-error-500" />
            )}
            {successMessage && !rightIcon && !showPasswordToggle && (
              <Check className="h-5 w-5 text-success-500" />
            )}

            {/* Password toggle */}
            {showPasswordToggle && type === 'password' && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            )}

            {/* Custom right icon */}
            {rightIcon && <span className="text-gray-400">{rightIcon}</span>}
          </div>
        </div>

        {/* Helper/Error/Success text */}
        {(helperText || errorMessage || successMessage) && (
          <p
            id={errorMessage ? `${inputId}-error` : `${inputId}-helper`}
            className={cn(
              'mt-2 text-sm',
              errorMessage && 'text-error-600',
              successMessage && 'text-success-600',
              !errorMessage && !successMessage && 'text-gray-500'
            )}
          >
            {errorMessage || successMessage || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };
