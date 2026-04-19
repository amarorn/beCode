import React, { HTMLAttributes } from 'react';

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ children, className = '', ...props }) => {
  return (
    <div className="w-full overflow-x-auto rounded border border-border dark:border-border-dark">
      <table className={`w-full text-left border-collapse ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
};

export interface TableHeadProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export const TableHead: React.FC<TableHeadProps> = ({ children, className = '', ...props }) => {
  return (
    <thead className={`bg-surface-alt dark:bg-surface-dark-muted/30 ${className}`} {...props}>
      {children}
    </thead>
  );
};

export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export const TableBody: React.FC<TableBodyProps> = ({ children, className = '', ...props }) => {
  return (
    <tbody className={`divide-y divide-border dark:divide-border-dark bg-surface dark:bg-surface-dark-alt ${className}`} {...props}>
      {children}
    </tbody>
  );
};

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
  hover?: boolean;
}

export const TableRow: React.FC<TableRowProps> = ({ children, hover = true, className = '', ...props }) => {
  const hoverClass = hover ? 'hover:bg-surface-muted/50 dark:hover:bg-surface-dark-muted/20 transition-colors' : '';
  return (
    <tr className={`${hoverClass} ${className}`} {...props}>
      {children}
    </tr>
  );
};

export interface TableHeaderProps extends HTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ children, className = '', ...props }) => {
  return (
    <th className={`px-4 py-3 text-sm font-semibold text-content dark:text-content-dark whitespace-nowrap ${className}`} {...props}>
      {children}
    </th>
  );
};

export interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

export const TableCell: React.FC<TableCellProps> = ({ children, className = '', ...props }) => {
  return (
    <td className={`px-4 py-3 text-sm text-content-muted dark:text-content-dark-muted ${className}`} {...props}>
      {children}
    </td>
  );
};
