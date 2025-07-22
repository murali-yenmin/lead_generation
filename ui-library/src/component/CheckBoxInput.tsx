import { useEffect, useRef } from 'react';
import { CheckProps } from '../interfaces/formFields';
import CheckBoxTick from './Images/CheckBoxTick';
import CheckBoxMinus from './Images/CheckBoxMinus';
export const CheckBoxInput = ({
  name,
  checked = false,
  onChange,
  disabled = false,
  indeterminate = false,
  onClick,
  isHeader = false, // ✅ New prop to identify "Select All"
}: CheckProps) => {
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label className={`custom-checkbox ${disabled ? 'disabled' : ''}`}>
      <input
        ref={checkboxRef}
        type="checkbox"
        id={name}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        onClick={(e) => onClick?.(e)}
      />
      <span className={`checkMark ${checked ? 'checked' : indeterminate ? 'indeterminate' : ''}`}>
        {isHeader && indeterminate ? <CheckBoxMinus /> : checked && <CheckBoxTick />}
        {/* ✅ Minus only for "Select All" checkbox when indeterminate */}
        {/* ✅ Tick for everything else */}
      </span>
    </label>
  );
};
