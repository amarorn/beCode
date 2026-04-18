import React, { HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status?: 'info' | 'success' | 'warning' | 'error' | 'default';
}

export const Badge: React.FC<BadgeProps> = ({
  status = 'default',
  className = '',
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium';

  const statusClasses = {
    default: 'bg-surface-muted text-content-muted dark:bg-surface-dark-muted dark:text-content-dark-muted border border-border dark:border-border-dark',
    info: 'bg-blue-100 text-status-info dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
    success: 'bg-green-100 text-status-success dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800',
    warning: 'bg-yellow-100 text-status-warning dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800',
    error: 'bg-red-100 text-status-error dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800',
  };

  const combinedClasses = `${baseClasses} ${statusClasses[status]} ${className}`;

  return (
    <span className={combinedClasses} {...props}>
      {children}
    </span>
  );
};
