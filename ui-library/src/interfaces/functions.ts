import { SetStateAction } from "react";

export interface OutsideClickProps {
  wrapperRef: any;
  setIsOpen: SetStateAction<any>;
}

export interface PasswordStrengthMeterProps {
  password: string;
  setPasswordValidate: SetStateAction<any>;
}
