import React, { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, helperText, label, id, ...props }, ref) => {
    const baseClasses = 'w-full px-3 py-2 bg-surface text-content border rounded outline-none transition-colors duration-150 ease-in-out dark:bg-surface-dark-alt dark:text-content-dark placeholder-content-muted dark:placeholder-content-dark-muted ide-focus-ring';
    
    const stateClasses = error 
      ? 'border-status-error focus:ring-status-error/50' 
      : 'border-border dark:border-border-dark focus:border-border-focus dark:focus:border-border-focus';

    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className="flex flex-col w-full gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-content dark:text-content-dark">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`${baseClasses} ${stateClasses} ${className}`}
          {...props}
        />
        {helperText && (
          <span className={`text-xs ${error ? 'text-status-error' : 'text-content-muted dark:text-content-dark-muted'}`}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
