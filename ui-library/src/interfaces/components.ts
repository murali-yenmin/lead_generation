import { Dispatch, ReactNode, SetStateAction } from 'react';
import { DateObject } from 'react-multi-date-picker';

export interface ErrorValidationProps {
  errors: any;
  name?: string;
  sizeMax?: number | string;
  sizeMin?: number | string;
  matchField?: string;
}

export interface CollapseProps {
  title: string;
  children: ReactNode;
  wrapperClass?: string;
}

export interface ProgressBarProps {
  progress: number;
  height?: number;
  progressBarClass?: string;
  progressFillClass?: string;
}

export interface BreadcrumbProps {
  url: string;
  className?: string;
  title: string;
  breadcrumbsItem: string;
}
interface ModalCommonProps {
  secondaryBtnCallback?: () => void;
  closeModal: () => void;
  title?: string;
  secondaryBtnName?: string;
  enableSecondaryBtn?: boolean;
}
export interface ConfirmationModalProps extends ModalCommonProps {
  primaryBtnCallback: () => void;
  primaryBtnName: string;
  description: string;
  loader?: boolean;
}

export interface CoreModalProps extends ModalCommonProps {
  primaryBtnCallback?: () => void;
  primaryBtnName?: string;
  children: ReactNode;
  enableHeader?: boolean;
  enableFooter?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  enablePrimaryBtn?: boolean;
  enableCloseIcon?: boolean;
}
export interface AccordionItem {
  title: ReactNode;
  content: ReactNode;
  icon?: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpen?: number;
  id?: '';
}

export interface CardProps {
  title?: string;
  cardClass?: string;
  children: ReactNode;
  footer?: ReactNode;
  Icons?: ReactNode;
  cardHeaderClass?: string;
}

export interface BadgeProps {
  text: string;
  type: 'primary' | 'secondary';
}

interface Tab {
  label: string | ReactNode;
  content: ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  tabWrapperClass?: string;
  tabHeaderClass?: string;
  tabButtonClass?: string;
}
export interface BreadcrumbProps {
  separator?: string;
  className?: string;
}

export interface OffCanvasProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right';
  children: ReactNode;
}

export interface UserProfileProps {
  name: string;
  role?: string;
  imageUrl?: string;
  enableDropdown?: boolean;
  dropDownItems?: DropdownItem[];
  onClickProfile?: () => void;
  loader?: boolean;
}

export interface DropdownItem {
  label: string;
  icon?: ReactNode;
  className?: string;
  onClick?: () => void;
}

// ThreeDot Drop Down
interface ThreeDotDropdownOption {
  label: string;
  onClick?: (setIsOpen: Dispatch<SetStateAction<boolean>>) => void;
  disabled?: boolean;
}

export interface ThreeDotDropdownProps {
  types?:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'left-top'
    | 'left-bottom'
    | 'right-top'
    | 'right-bottom';
  threeDotOptions: ThreeDotDropdownOption[];
}

export interface PopoverContent {
  title?: string;
  body?: string;
  image?: string;
}

export interface PopoverProps {
  content: PopoverContent;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  enableTitle?: boolean;
}

export interface DatePickerInputProps {
  required?: boolean;
  disabled?: boolean;
  label: string;
  value: Date | DateObject | null | undefined;
  onChange: Function;
  id?: string;
  minDate?: string | number | Date | DateObject | undefined;
}

export interface DateRangeInputProps {
  label: string;
  value?: { start: string; end: string } | null | undefined;
  onChange?: (value: { start: string; end: string } | null) => void;
  id: string;
  minDate?: string | number | DateObject | Date | undefined;
  maxDate?: string | number | DateObject | Date | undefined;
  required?: boolean;
  dateFormat?: string;
}

export interface InputOtpProps {
  otp: string;
  setOtp: (otp: string) => void | SetStateAction<string>;
  inputStyle?: string;
  containerStyle?: string;
  afterInputFilled?: () => void;
}
export interface InfoBarProps {
  children: React.ReactNode;
  type?: 'info' | 'warning' | 'success ' | 'error';
}

export interface SearchProps {
  onChange: Function;
  placeholder?: string;
  value?: string;
}

export interface ExpiryDateInputProps {
  value: {
    month: number | string;
    year: number | string;
  };
  onChange: (value: { month: number | string; year: number | string }) => void;
  disabled?: boolean;
  readOnly?: boolean;
  setFocused?: Dispatch<SetStateAction<boolean>>;
}

export interface Prediction {
  description: string;
  place_id: string;
}

export interface GoogleAddressProps {
  id?: string;
  label: string;
  value?: string;
  apiKey: string;
  placeholder?: string;
  error?: any;
  required?: boolean;
  sizeMax?: number;
  sizeMin?: number;
  onChange: (val: string) => void;
  onSelect: ({
    fullAddress,
    address,
  }: {
    fullAddress: string;
    address: Record<string, string>;
  }) => void;
}
