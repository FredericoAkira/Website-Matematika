import type {
    ForwardRefExoticComponent,
    HTMLAttributes,
    RefAttributes,
    TdHTMLAttributes,
    ThHTMLAttributes,
} from "react";
  
  export type TableBodyProps = ForwardRefExoticComponent<
    HTMLAttributes<HTMLTableSectionElement> &
      RefAttributes<HTMLTableSectionElement>
  >;
  
  export type TableCaptionProps = ForwardRefExoticComponent<
    HTMLAttributes<HTMLTableCaptionElement> &
      RefAttributes<HTMLTableCaptionElement>
  >;
  
  export type TableCellProps = ForwardRefExoticComponent<
    TdHTMLAttributes<HTMLTableCellElement> & RefAttributes<HTMLTableCellElement>
  >;
  
  export type TableFooterProps = ForwardRefExoticComponent<
    HTMLAttributes<HTMLTableSectionElement> &
      RefAttributes<HTMLTableSectionElement>
  >;
  
  export type TableHeadProps = ForwardRefExoticComponent<
    ThHTMLAttributes<HTMLTableCellElement> & RefAttributes<HTMLTableCellElement>
  >;
  
  export type TableHeaderProps = ForwardRefExoticComponent<
    HTMLAttributes<HTMLTableSectionElement> &
      RefAttributes<HTMLTableSectionElement>
  >;
  
  export type TableRowProps = ForwardRefExoticComponent<
    HTMLAttributes<HTMLTableRowElement> & RefAttributes<HTMLTableRowElement>
  >;
  
  type TableSubComponents = {
    Body: TableBodyProps;
    Caption: TableCaptionProps;
    Cell: TableCellProps;
    Footer: TableFooterProps;
    Head: TableHeadProps;
    Header: TableHeaderProps;
    Row: TableRowProps;
  };
  
  export type TableComponent = ForwardRefExoticComponent<
    HTMLAttributes<HTMLTableElement> & RefAttributes<HTMLTableElement>
  > &
    TableSubComponents;
  