import { SetStateAction } from 'react';
import { DateObject } from 'react-multi-date-picker';
import { string } from 'yup';

export interface columns {
  name: string;
  accessField: string;
  tdClassName?: string;
  thClassName?: string;
  cellClassName?: string;
  th?: Function;
  td?: Function;
  isSort?: boolean;
  fixed?: boolean;
  width?: string;
  left?: string;
}

export interface tableHeadProps {
  columns: Array<columns>;
  tableName: string;
  sort?: { value: string; field: string } | null;
  setSort?: (sort: { value: string; field: string }) => void;
  selectedRows?: string[];
  onSelectAll?: () => void;
  isSelected?: boolean;
  data: Array<Record<string, any>>;
  defaultSort?: string;
  isExpanded?: boolean;
}

export interface tableBodyProps extends tableHeadProps {
  data: Array<Record<string, any>>;
  rowSubComponent?: ((row: any) => React.ReactNode) | null;
  onSelectRow?: (e: any) => void;
  onSelectedRowsChange?: (selectedRowsData: any[]) => void;
}
export interface QueryProps {
  operation: string;
  fieldName: string;
  fieldString: string | string[];
}

interface dateRangeFilterProps {
  start: string;
  end: string;
}

export interface TableProps extends tableBodyProps {
  isPagination?: boolean;
  currentPage?: number;
  setCurrentPage?: SetStateAction<any>;
  totalCount?: number;
  pageSize?: string;
  setPageSize?: SetStateAction<any>;
  customPageSize?: boolean;
  isExpanded?: boolean;
  rowSubComponent?: ((row: any) => React.ReactNode) | null;
  tableWidth?: string;
  enableScrollX?: boolean;
  minWidth?: string;
  isSelected?: boolean;
  filterSection?: boolean;
  filter?: {
    query: QueryProps[];
    sort: {
      field: string;
      value: string | string[];
    };
  };
  setFilter?: React.Dispatch<React.SetStateAction<any>>;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchableFields?: { fieldName: string; operation?: string }[];
  customFilter?: React.ReactNode;
  filterOption?: boolean;
  filterList?: any;
  scrollTop?: boolean;
  isDateFilter?: boolean;
  defaultDate?: dateRangeFilterProps | null;
  daterange?: dateRangeFilterProps | null;
  setDateRange?: (range: dateRangeFilterProps | null) => void;
  maxDate?: string | number | DateObject | Date;
  minDate?: string | number | DateObject | Date;
}

export interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  onPageChange: Function;
  siblingCount?: number;
}

export interface UsePaginationProps {
  totalCount: number;
  pageSize: number;
  siblingCount: number;
  currentPage: number;
}

export interface DataPerPageProps {
  options: Array<DataPerPageOptionsProps>;
  onSelect: Function | SetStateAction<any>;
  searchable?: boolean;
  value?: string | boolean | null | any;
  parentClass?: string;
  toggleClass?: string;
  placeholder?: string;
  menuClass?: string;
}

export interface DataPerPageOptionsProps {
  label: string;
  value: string;
}

export interface FilterItem {
  fieldName: string;
  operation: string;
  name: string;
  label: string;
  value: string;
}

export type FilterOutput = {
  [key: string]: string[];
};
