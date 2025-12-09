import React from 'react';

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  className?: string;
}

export const Table: React.FC<TableProps> = ({ className, ...props }) => (
  <table className={`w-full caption-bottom text-sm ${className}`} {...props} />
);

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ className, ...props }) => (
  <thead className={`[&_tr]:border-b ${className}`} {...props} />
);

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string;
}

export const TableBody: React.FC<TableBodyProps> = ({ className, ...props }) => (
  <tbody className={`[&_tr:last-child]:border-0 ${className}`} {...props} />
);

export interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string;
}

export const TableFooter: React.FC<TableFooterProps> = ({ className, ...props }) => (
  <tfoot className={`border-t bg-gray-100 font-medium [&>tr]:last:text-base ${className}`} {...props} />
);

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  className?: string;
}

export const TableRow: React.FC<TableRowProps> = ({ className, ...props }) => (
  <tr
    className={`border-b transition-colors hover:bg-gray-100 data-[state=selected]:bg-gray-100 ${className}`}
    {...props}
  />
);

export interface TableHeadProps extends React.HTMLAttributes<HTMLTableCellElement> {
  className?: string;
}

export const TableHead: React.FC<TableHeadProps> = ({ className, ...props }) => (
  <th
    className={`h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 ${className}`}
    {...props}
  />
);

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  className?: string;
  colSpan?: number;
}

export const TableCell: React.FC<TableCellProps> = ({ className, ...props }) => (
  <td
    className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}
    {...props}
  />
);

export interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {
  className?: string;
}

export const TableCaption: React.FC<TableCaptionProps> = ({ className, ...props }) => (
  <caption className={`mt-4 text-sm text-gray-500 ${className}`} {...props} />
);
