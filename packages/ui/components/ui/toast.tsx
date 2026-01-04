import * as React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

const ToastProvider = ToastPrimitive.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      'fixed bottom-0 right-0 z-toast',
      'flex flex-col gap-3 p-6',
      'max-h-screen w-full sm:max-w-[420px]',
      'outline-none',
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitive.Viewport.displayName;

const toastVariants = cva(
  [
    'group relative pointer-events-auto',
    'flex items-start gap-3 w-full',
    'rounded-lg border p-4',
    'bg-white shadow-xl',
    'transition-all',
    'data-[swipe=cancel]:translate-x-0',
    'data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]',
    'data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]',
    'data-[swipe=move]:transition-none',
    'data-[state=open]:animate-slide-in-right',
    'data-[state=closed]:animate-fade-out',
  ],
  {
    variants: {
      variant: {
        default: 'border-gray-200',
        success: 'border-l-4 border-l-success-500 border-success-200',
        error: 'border-l-4 border-l-error-500 border-error-200',
        warning: 'border-l-4 border-l-warning-500 border-warning-200',
        info: 'border-l-4 border-l-info-500 border-info-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitive.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
});
Toast.displayName = ToastPrimitive.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Action
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center',
      'px-3 py-1.5 rounded-md',
      'text-sm font-medium',
      'bg-magenta-50 text-magenta-600',
      'hover:bg-magenta-100',
      'focus:outline-none focus:ring-2 focus:ring-magenta-500 focus:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'transition-colors',
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitive.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={cn(
      'absolute right-2 top-2',
      'p-1 rounded-md',
      'text-gray-400 hover:text-gray-600',
      'opacity-0 group-hover:opacity-100',
      'focus:outline-none focus:ring-2 focus:ring-magenta-500',
      'transition-opacity',
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitive.Close>
));
ToastClose.displayName = ToastPrimitive.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={cn('font-poppins text-sm font-semibold text-gray-900', className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitive.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn('text-sm text-gray-500', className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitive.Description.displayName;

// Toast Icon based on variant
const ToastIcon: React.FC<{ variant?: 'default' | 'success' | 'error' | 'warning' | 'info' }> = ({
  variant = 'default',
}) => {
  const iconMap = {
    default: null,
    success: <CheckCircle className="h-5 w-5 text-success-500" />,
    error: <AlertCircle className="h-5 w-5 text-error-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-warning-500" />,
    info: <Info className="h-5 w-5 text-info-500" />,
  };

  return iconMap[variant];
};

// Types for useToast hook
type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

interface ToastData {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  action?: React.ReactNode;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, 'id'>) => void;
  removeToast: (id: string) => void;
  // Convenience methods
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

// Toast Provider Component
export const ToastProviderWithContext: React.FC<{
  children: React.ReactNode;
  duration?: number;
}> = ({ children, duration = 5000 }) => {
  const [toasts, setToasts] = React.useState<ToastData[]>([]);

  const addToast = React.useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = React.useCallback(
    (title: string, description?: string) => {
      addToast({ title, description, variant: 'success' });
    },
    [addToast]
  );

  const error = React.useCallback(
    (title: string, description?: string) => {
      addToast({ title, description, variant: 'error' });
    },
    [addToast]
  );

  const warning = React.useCallback(
    (title: string, description?: string) => {
      addToast({ title, description, variant: 'warning' });
    },
    [addToast]
  );

  const info = React.useCallback(
    (title: string, description?: string) => {
      addToast({ title, description, variant: 'info' });
    },
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, removeToast, success, error, warning, info }}
    >
      <ToastProvider duration={duration}>
        {children}
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            variant={toast.variant}
            onOpenChange={(open) => {
              if (!open) removeToast(toast.id);
            }}
          >
            <ToastIcon variant={toast.variant} />
            <div className="flex-1 space-y-1">
              {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
              {toast.description && (
                <ToastDescription>{toast.description}</ToastDescription>
              )}
            </div>
            {toast.action}
            <ToastClose />
          </Toast>
        ))}
        <ToastViewport />
      </ToastProvider>
    </ToastContext.Provider>
  );
};

// useToast hook
export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProviderWithContext');
  }
  return context;
};

export {
  type ToastData,
  type ToastVariant,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  ToastIcon,
};
