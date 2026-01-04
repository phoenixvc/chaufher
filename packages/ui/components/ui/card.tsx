import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const cardVariants = cva(['rounded-lg', 'transition-all duration-200'], {
  variants: {
    variant: {
      default: [
        'bg-white',
        'border border-gray-200',
        'shadow-card',
      ],
      elevated: [
        'bg-white',
        'border-0',
        'shadow-lg',
      ],
      outline: [
        'bg-white',
        'border-2 border-gray-200',
        'shadow-none',
      ],
      ghost: [
        'bg-gray-50',
        'border-0',
        'shadow-none',
      ],
      gradient: [
        'bg-gradient-soft',
        'border border-magenta-100',
        'shadow-sm',
      ],
      'gradient-primary': [
        'bg-gradient-primary',
        'border-0',
        'shadow-magenta',
        'text-white',
      ],
    },
    padding: {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
    hover: {
      true: 'hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'md',
    hover: false,
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, hover, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding, hover }), className)}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

// Card Header
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5', className)}
    {...props}
  />
));

CardHeader.displayName = 'CardHeader';

// Card Title
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'font-poppins text-xl font-semibold leading-tight text-gray-900',
      className
    )}
    {...props}
  />
));

CardTitle.displayName = 'CardTitle';

// Card Description
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-gray-500', className)}
    {...props}
  />
));

CardDescription.displayName = 'CardDescription';

// Card Content
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('', className)} {...props} />
));

CardContent.displayName = 'CardContent';

// Card Footer
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-4', className)}
    {...props}
  />
));

CardFooter.displayName = 'CardFooter';

// Stats Card (for dashboard)
interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  ({ className, title, value, description, icon, trend, ...props }, ref) => {
    return (
      <Card ref={ref} className={cn('', className)} {...props}>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold font-poppins text-gray-900">
              {value}
            </p>
            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}
            {trend && (
              <div
                className={cn(
                  'inline-flex items-center gap-1 text-sm font-medium',
                  trend.isPositive ? 'text-success-600' : 'text-error-600'
                )}
              >
                <span>{trend.isPositive ? '↑' : '↓'}</span>
                <span>{Math.abs(trend.value)}%</span>
                <span className="text-gray-500 font-normal">vs last period</span>
              </div>
            )}
          </div>
          {icon && (
            <div className="p-3 rounded-lg bg-gradient-soft">
              <span className="text-magenta-600">{icon}</span>
            </div>
          )}
        </div>
      </Card>
    );
  }
);

StatsCard.displayName = 'StatsCard';

export {
  Card,
  cardVariants,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  StatsCard,
};
