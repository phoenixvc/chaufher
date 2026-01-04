/**
 * ChaufHER Design System - Component Exports
 * 
 * Usage:
 * import { Button, Input, Badge } from '@/components';
 * 
 * Or import from specific files:
 * import { Button } from '@/components/ui/button';
 */

// Button
export {
  Button,
  buttonVariants,
  type ButtonProps,
} from './ui/button';

// Input
export {
  Input,
  inputVariants,
  type InputProps,
} from './ui/input';

// Badge
export {
  Badge,
  badgeVariants,
  RideStatusBadge,
  VerificationBadge,
  type BadgeProps,
  type RideStatus,
  type VerificationStatus,
} from './ui/badge';

// Card
export {
  Card,
  cardVariants,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  StatsCard,
  type CardProps,
} from './ui/card';

// Empty State
export {
  EmptyState,
  NoRidesEmptyState,
  NoDriversEmptyState,
  NoSearchResultsEmptyState,
  NoNotificationsEmptyState,
  ErrorEmptyState,
  type EmptyStateProps,
} from './ui/empty-state';

// Dialog/Modal
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogBody,
  ConfirmDialog,
} from './ui/dialog';

// Toast
export {
  ToastProvider,
  ToastProviderWithContext,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  ToastIcon,
  useToast,
  type ToastData,
  type ToastVariant,
} from './ui/toast';
