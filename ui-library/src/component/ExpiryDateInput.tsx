import React, { useRef, useState, useEffect } from 'react';
import { ExpiryDateInputProps } from '../interfaces/components';

export const ExpiryDateInput = ({
  value,
  onChange,
  disabled = false,
  readOnly = false,
  setFocused,
}: Readonly<ExpiryDateInputProps>) => {
  const maxMonth = 12;
  const maxYear = new Date().getFullYear() + 25;
  const currentYear = new Date().getFullYear();

  const [month, setMonth] = useState(value.month.toString());
  const [year, setYear] = useState(value.year.toString());

  const monthInputRef = useRef<HTMLInputElement>(null);
  const yearInputRef = useRef<HTMLInputElement>(null);

  // Keep internal state in sync with props
  useEffect(() => {
    setMonth(value.month.toString());
    setYear(value.year.toString());
  }, [value]);

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);

    if (parseInt(val) > maxMonth) {
      val = maxMonth.toString().padStart(2, '0');
    }

    setMonth(val);
    onChange({ month: val, year });

    if (val.length === 2) {
      yearInputRef.current?.focus();
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);

    if (val.length === 0) {
      monthInputRef.current?.focus();
    }

    if (val.length === 4) {
      let numYear = parseInt(val);
      if (numYear > maxYear) {
        val = maxYear.toString();
      } else if (numYear < currentYear) {
        val = currentYear.toString();
      }
    }

    setYear(val);
    onChange({ month, year: val });
  };

  const handleFocus = () => {
    setFocused?.(true);
  };

  const handleBlur = () => {
    setFocused?.(false);
  };

  return (
    <div className="expiry-input-wrapper">
      <input
        ref={monthInputRef}
        className="expiry-input"
        type="text"
        value={month}
        onChange={handleMonthChange}
        placeholder="MM"
        maxLength={2}
        disabled={disabled}
        readOnly={readOnly}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <input
        ref={yearInputRef}
        className="expiry-input"
        type="text"
        value={year}
        onChange={handleYearChange}
        placeholder="YYYY"
        maxLength={4}
        disabled={disabled}
        readOnly={readOnly}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
};
