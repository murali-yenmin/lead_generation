import DatePicker, { DateObject } from 'react-multi-date-picker';
import Calendar from './Images/Calendar';
import { useState } from 'react';
import { DatePickerInputProps } from '../interfaces/components';

export const DatePickerInput = ({
  label,
  value,
  onChange,
  id,
  minDate = undefined,
  required = false,
  disabled = false,
}: DatePickerInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="date-picker-wrapper">
      <label
        className={`input-label ${isFocused || value ? 'input-focused' : ''}`}
        htmlFor={`datepicker${id}`}
      >
        {label}
        {required && <span> *</span>}
      </label>
      <DatePicker
        inputClass={`date-input rmdp-input`}
        value={value}
        editable={false}
        onChange={(date: DateObject | null) => {
          const value = date?.format('MM/DD/YYYY');
          onChange?.(value);
        }}
        format="MM/DD/YYYY"
        minDate={minDate}
        id={`datepicker${id}`}
        onOpen={() => setIsFocused(true)}
        onClose={() => setIsFocused(false)}
        disabled={disabled}
      />
      <label htmlFor={`datepicker${id}`} className="calendar-icon">
        <Calendar />
      </label>
    </div>
  );
};
