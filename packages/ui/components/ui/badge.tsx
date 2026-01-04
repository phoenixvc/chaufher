import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  [
    'inline-flex items-center gap-1.5',
    'font-inter text-xs font-semibold',
    'rounded-full',
    'border',
    'whitespace-nowrap',
  ],
  {
    variants: {
      variant: {
        // Ride Statuses
        scheduled: 'bg-purple-50 text-purple-700 border-purple-200',
        assigned: 'bg-info-50 text-info-700 border-info-200',
        'en-route': 'bg-warning-50 text-warning-700 border-warning-200',
        arrived: 'bg-magenta-50 text-magenta-700 border-magenta-200',
        'in-progress': 'bg-info-50 text-info-700 border-info-200',
        completed: 'bg-success-50 text-success-700 border-success-200',
        cancelled: 'bg-error-50 text-error-700 border-error-200',
        
        // Document/Verification Statuses
        verified: 'bg-success-50 text-success-700 border-success-200',
        pending: 'bg-warning-50 text-warning-700 border-warning-200',
        rejected: 'bg-error-50 text-error-700 border-error-200',
        expired: 'bg-gray-100 text-gray-700 border-gray-300',
        
        // Generic Statuses
        default: 'bg-gray-100 text-gray-700 border-gray-200',
        primary: 'bg-magenta-50 text-magenta-700 border-magenta-200',
        secondary: 'bg-purple-50 text-purple-700 border-purple-200',
        success: 'bg-success-50 text-success-700 border-success-200',
        warning: 'bg-warning-50 text-warning-700 border-warning-200',
        error: 'bg-error-50 text-error-700 border-error-200',
        info: 'bg-info-50 text-info-700 border-info-200',

        // Solid variants
        'solid-primary': 'bg-magenta-500 text-white border-magenta-500',
        'solid-success': 'bg-success-500 text-white border-success-500',
        'solid-warning': 'bg-warning-500 text-white border-warning-500',
        'solid-error': 'bg-error-500 text-white border-error-500',
      },
      size: {
        sm: 'px-2 py-0.5 text-2xs',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
  dot?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, icon, dot, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              variant === 'completed' || variant === 'verified' || variant === 'success'
                ? 'bg-success-500'
                : variant === 'cancelled' || variant === 'rejected' || variant === 'error'
                ? 'bg-error-500'
                : variant === 'en-route' || variant === 'pending' || variant === 'warning'
                ? 'bg-warning-500'
                : variant === 'scheduled' || variant === 'secondary'
                ? 'bg-purple-500'
                : variant === 'arrived' || variant === 'primary'
                ? 'bg-magenta-500'
                : 'bg-gray-500'
            )}
          />
        )}
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// Helper component for ride status
export type RideStatus =
  | 'scheduled'
  | 'assigned'
  | 'en-route'
  | 'arrived'
  | 'in-progress'
  | 'completed'
  | 'cancelled';

const rideStatusLabels: Record<RideStatus, string> = {
  scheduled: 'Scheduled',
  assigned: 'Driver Assigned',
  'en-route': 'Driver En Route',
  arrived: 'Driver Arrived',
  'in-progress': 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

interface RideStatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: RideStatus;
}

const RideStatusBadge = React.forwardRef<HTMLSpanElement, RideStatusBadgeProps>(
  ({ status, children, ...props }, ref) => {
    return (
      <Badge ref={ref} variant={status} dot {...props}>
        {children || rideStatusLabels[status]}
      </Badge>
    );
  }
);

RideStatusBadge.displayName = 'RideStatusBadge';

// Helper component for document verification status
export type DocumentStatus = 'verified' | 'pending' | 'rejected' | 'expired';

const documentStatusLabels: Record<DocumentStatus, string> = {
  verified: 'Verified',
  pending: 'Pending',
  rejected: 'Rejected',
  expired: 'Expired',
};

interface DocumentStatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: DocumentStatus;
}

const DocumentStatusBadge = React.forwardRef<HTMLSpanElement, DocumentStatusBadgeProps>(
  ({ status, children, ...props }, ref) => {
    return (
      <Badge ref={ref} variant={status} dot {...props}>
        {children || documentStatusLabels[status]}
      </Badge>
    );
  }
);

DocumentStatusBadge.displayName = 'DocumentStatusBadge';

export { Badge, badgeVariants, RideStatusBadge, DocumentStatusBadge };
