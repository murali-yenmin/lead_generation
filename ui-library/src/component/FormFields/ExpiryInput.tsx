import { Controller } from 'react-hook-form';
import { ExpiryInputProps } from '../../interfaces/formFields';
import ErrorValidation from '../ErrorValidation';
import { ExpiryDateInput } from '../ExpiryDateInput';
import { useState } from 'react';

export const ExpiryInput = (inputProps: Readonly<ExpiryInputProps>) => {
  const {
    label,
    name,
    control,
    error,
    required = false,
    disabled = false,
    className = '',
    readOnly = false,
    onChange,
  } = inputProps;

  const [focused, setFocused] = useState(false);

  const getFocusedClass = ({ month, year }: { month: string; year: string }) => {
    return focused || month || year ? 'input-focused' : '';
  };

  const getRequiredClass = ({ month, year }: { month: string; year: string }) => {
    return focused || month || year ? 'required' : '';
  };

  return (
    <div className={`form-control ${className}`}>
      <Controller
        name={name}
        control={control}
        defaultValue={{ month: '', year: '' }} // ensure default
        render={({ field }) => (
          <div className={`field ${getFocusedClass(field.value)}`}>
            <ExpiryDateInput
              value={field.value}
              onChange={(val) => {
                field.onChange(val);
                onChange?.(val);
              }}
              disabled={disabled}
              readOnly={readOnly}
              setFocused={setFocused}
            />
            {label && (
              <label className={`input-label ${getFocusedClass(field.value)}`} htmlFor={name}>
                {label}
                {required && <span className={getRequiredClass(field.value)}>*</span>}
              </label>
            )}
          </div>
        )}
      />

      {error && <ErrorValidation errors={error} name={label?.toLowerCase()} />}
    </div>
  );
};
