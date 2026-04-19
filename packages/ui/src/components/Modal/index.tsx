import React, { ReactNode, useEffect } from 'react';
import { Button } from '../Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-content/50 dark:bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Dialog */}
      <div 
        className={`relative w-full ${sizeClasses[size]} mx-4 bg-surface dark:bg-surface-dark-alt rounded-lg shadow-modal border border-border dark:border-border-dark flex flex-col max-h-[90vh]`}
        role="dialog"
        aria-modal="true"
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border dark:border-border-dark">
            <h2 className="text-lg font-semibold text-content dark:text-content-dark">{title}</h2>
            <button
              onClick={onClose}
              className="text-content-muted hover:text-content dark:text-content-dark-muted dark:hover:text-content-dark transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        <div className="px-6 py-4 overflow-y-auto">
          {children}
        </div>

        {footer ? (
          <div className="px-6 py-4 border-t border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark-muted/30 rounded-b-lg">
            {footer}
          </div>
        ) : (
          <div className="px-6 py-4 border-t border-border dark:border-border-dark bg-surface-alt dark:bg-surface-dark-muted/30 rounded-b-lg flex justify-end gap-2">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={onClose}>Confirm</Button>
          </div>
        )}
      </div>
    </div>
  );
};
