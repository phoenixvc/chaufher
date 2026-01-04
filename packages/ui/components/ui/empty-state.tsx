import * as React from 'react';
import { cn } from '../../lib/utils';
import { Button } from './button';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    { className, icon, title, description, action, secondaryAction, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center py-16 px-6 text-center',
          className
        )}
        {...props}
      >
        {/* Icon */}
        {icon && (
          <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-gradient-soft">
            <span className="text-gray-400 w-10 h-10">{icon}</span>
          </div>
        )}

        {/* Title */}
        <h3 className="font-poppins text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-base text-gray-500 max-w-md mb-8">{description}</p>
        )}

        {/* Actions */}
        {(action || secondaryAction) && (
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {action && (
              <Button variant="primary" onClick={action.onClick}>
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button variant="ghost" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';

// Preset empty states for common scenarios
interface PresetEmptyStateProps extends Omit<EmptyStateProps, 'title'> {
  title?: string;
}

// No Rides Empty State
const NoRidesEmptyState = React.forwardRef<HTMLDivElement, PresetEmptyStateProps>(
  ({ title = 'No rides yet', description, action, ...props }, ref) => (
    <EmptyState
      ref={ref}
      title={title}
      description={description || "You haven't scheduled any rides yet. Book your first safe ride now!"}
      icon={
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10l-2-4H8L6 10l-2.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2" />
          <circle cx="7" cy="17" r="2" />
          <circle cx="17" cy="17" r="2" />
        </svg>
      }
      action={action || { label: 'Schedule a Ride', onClick: () => {} }}
      {...props}
    />
  )
);

NoRidesEmptyState.displayName = 'NoRidesEmptyState';

// No Drivers Empty State (for admin)
const NoDriversEmptyState = React.forwardRef<HTMLDivElement, PresetEmptyStateProps>(
  ({ title = 'No drivers found', description, action, ...props }, ref) => (
    <EmptyState
      ref={ref}
      title={title}
      description={description || 'No drivers match your search criteria. Try adjusting your filters.'}
      icon={
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="19" y2="14" />
          <line x1="22" y1="11" x2="16" y2="11" />
        </svg>
      }
      action={action}
      {...props}
    />
  )
);

NoDriversEmptyState.displayName = 'NoDriversEmptyState';

// No Search Results Empty State
const NoSearchResultsEmptyState = React.forwardRef<HTMLDivElement, PresetEmptyStateProps>(
  ({ title = 'No results found', description, action, ...props }, ref) => (
    <EmptyState
      ref={ref}
      title={title}
      description={description || "We couldn't find anything matching your search. Try different keywords."}
      icon={
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      }
      action={action}
      {...props}
    />
  )
);

NoSearchResultsEmptyState.displayName = 'NoSearchResultsEmptyState';

// No Notifications Empty State
const NoNotificationsEmptyState = React.forwardRef<HTMLDivElement, PresetEmptyStateProps>(
  ({ title = "You're all caught up!", description, ...props }, ref) => (
    <EmptyState
      ref={ref}
      title={title}
      description={description || 'No new notifications at the moment. We\'ll let you know when something comes up.'}
      icon={
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
      }
      {...props}
    />
  )
);

NoNotificationsEmptyState.displayName = 'NoNotificationsEmptyState';

// Error Empty State
const ErrorEmptyState = React.forwardRef<HTMLDivElement, PresetEmptyStateProps>(
  ({ title = 'Something went wrong', description, action, ...props }, ref) => (
    <EmptyState
      ref={ref}
      title={title}
      description={description || 'We encountered an error while loading this page. Please try again.'}
      icon={
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-error-400"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      }
      action={action || { label: 'Try Again', onClick: () => window.location.reload() }}
      {...props}
    />
  )
);

ErrorEmptyState.displayName = 'ErrorEmptyState';

export {
  EmptyState,
  NoRidesEmptyState,
  NoDriversEmptyState,
  NoSearchResultsEmptyState,
  NoNotificationsEmptyState,
  ErrorEmptyState,
};
