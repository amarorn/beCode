import React, { HTMLAttributes } from 'react';

export interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export const Panel: React.FC<PanelProps> = ({
  title,
  className = '',
  children,
  ...props
}) => {
  return (
    <div className={`ide-panel flex flex-col ${className}`} {...props}>
      {title && (
        <div className="px-4 py-2 border-b border-border dark:border-border-dark bg-surface dark:bg-surface-dark-alt rounded-t">
          <h3 className="text-sm font-semibold text-content dark:text-content-dark">{title}</h3>
        </div>
      )}
      <div className="p-4 flex-1">
        {children}
      </div>
    </div>
  );
};
