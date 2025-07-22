import { ReactNode } from 'react';

export interface ButtonProps {
  label: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'link' | 'social';
  icon?: ReactNode;
  loading?: boolean;
  className?: string;
}
