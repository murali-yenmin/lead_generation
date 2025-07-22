import { MouseEvent, ReactNode } from 'react';
import { DateObject } from 'react-multi-date-picker';

interface Common {
  label?: string;
  name: string;
  control: any;
  error?: any;
  required?: boolean;
  placeholder?: string;
  className?: string;
  maxLength?: number;
  max?: number;
  onBlur?: (value: string) => void;
  value?: string | number;
}

export interface PasswordProps extends Common {
  sizeMax?: number;
  sizeMin?: number;
  matchField?: string;
  onChange?: Function;
  readOnly?: boolean;
}

export interface InputProps extends PasswordProps {
  type?: 'text' | 'email' | 'number' | 'password';
  icon?: any;
  disabled?: boolean;
  acceptAlphabetOnly?: boolean;
  acceptNumberOnly?: boolean;
  pasteAllow?: boolean;
}

export interface ExpiryInputProps extends Common {
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: (val: { month: number | string; year: number | string }) => void;
}

export interface PhoneNumberProps extends PasswordProps {
  countryCode?: string;
  format: number[];
  disabled?: boolean;
}

export interface CheckboxProps extends Common {
  parentClassName?: string;
  labelClassName?: string;
  defaultSelected?: boolean;
  disabled?: boolean;
  onChange?: Function;
}

//non hook form fields

interface CheckboxOption {
  value: string;
  label: string;
}

export interface CheckboxGroupProps {
  label: string;
  name: string;
  options: CheckboxOption[];
  onChange?: (selectedValues: string[]) => void;
  control: any;
  error: any;
  required: boolean;
}

export interface DatepickerProps extends Common {
  minDate?: string | number | Date | DateObject | undefined;
  onChange?: Function;
  disabled?: boolean;
  id?: string;
  icon?: any;
}

interface RadioOption {
  value: string;
  label: string;
}

export interface RadioProps extends Common {
  options: RadioOption[];
  onChange?: (selectedValue: string) => void;
}

export interface ToggleSwitchProps {
  label: string;
  name: string;
  onClick?: (checked: boolean) => void;
  defaultChecked?: boolean;
  disabled?: boolean;
  value?: boolean;
}

export interface FileUploadProps extends Common {
  id: string;
  name: string;
  label: string;
  allowedFileTypes?: string[]; // Allow custom file types (e.g., ['image/png', 'image/jpeg'])
  onChange?: Function;
}

export interface DropdownProps extends Common {
  options: { label: string; value: string }[];
  onSelect?: (value: { label: string; value: string }) => void;
  searchable?: boolean;
  placeholder?: string;
  disabled?: boolean;
  parentClass?: string;
  toggleClass?: string;
  multiselect?: boolean;
  innerRef?: any;
  defaultValue?: string | number | (string | number)[];
}

export interface TextAreaProps extends Common {
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: (onchangeValue: string) => void;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectDropdownProps {
  disabled?: boolean;
  options: SelectOption[];
  selectedValues: SelectOption | SelectOption[] | null;
  searchable?: boolean;
  multiselect?: boolean;
  minDate?: string | number | DateObject | Date | undefined;
  maxDate?: string | number | DateObject | Date | undefined;
  placeholder?: string;
  onSelect: (option: SelectOption) => void;
  enableDateRange?: boolean;
  onDateRangeChange?: (
    value: {
      start: string;
      end: string;
    } | null,
  ) => void;
  dateRangeValue?: {
    start: string;
    end: string;
  } | null;
}

export interface CheckProps {
  name?: string;
  checked?: boolean;
  onChange?: Function;
  disabled?: boolean;
  indeterminate?: boolean;
  isHeader?: boolean;
  isSelectAll?: boolean;
  onClick?: (e: MouseEvent<HTMLInputElement>) => void;
}
export interface CardInfoListProps {
  logo: ReactNode;
  cardName: string;
  cardNumber: string;
  onClick?: () => void;
  checked?: boolean;
  type: 'credit' | 'debit' | 'bank';
  disabled?: boolean;
}

export interface AddCardBtnProps {
  name: string | null;
  onClick?: () => void;
}
