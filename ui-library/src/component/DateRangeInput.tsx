import DatePicker, { DateObject } from 'react-multi-date-picker';
import Calendar from './Images/Calendar';
import { useState } from 'react';
import { DateRangeInputProps } from '../interfaces/components';

enum DateFormat {
  DISPLAY = 'MM/DD/YYYY',
}

interface ValueRange {
  start: string;
  end: string;
}

export const DateRangeInput = ({
  label,
  value,
  onChange,
  id,
  minDate,
  maxDate,
  required = false,
  dateFormat = DateFormat.DISPLAY,
}: DateRangeInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const formatValue = (range: DateObject[] | null): ValueRange | null => {
    if (!range || range.length !== 2) return null;
    return {
      start: range[0]?.format(dateFormat),
      end: range[1]?.format(dateFormat),
    };
  };

  const toDateObjectRange = (range: ValueRange | null): DateObject[] | undefined => {
    if (!range) return undefined;
    return [
      new DateObject({ date: range.start, format: dateFormat }),
      new DateObject({ date: range.end, format: dateFormat }),
    ];
  };

  const dateObjectRange = toDateObjectRange(value as ValueRange);

  return (
    <div className="date-picker-wrapper date-range-input">
      <label
        htmlFor={`datepicker${id}`}
        className={`input-label ${isFocused || dateObjectRange ? 'input-focused' : ''}`}
      >
        {label}
        {required && <span> *</span>}
      </label>
      <DatePicker
        inputClass="date-input rmdp-input"
        value={dateObjectRange}
        range
        editable={false}
        onChange={(range) => onChange?.(formatValue(range))}
        format={dateFormat}
        minDate={minDate}
        maxDate={maxDate}
        id={`datepicker${id}`}
        onOpen={() => setIsFocused(true)}
        onClose={() => setIsFocused(false)}
      />
      <label htmlFor={`datepicker${id}`} className="calendar-icon">
        <Calendar />
      </label>
    </div>
  );
};
