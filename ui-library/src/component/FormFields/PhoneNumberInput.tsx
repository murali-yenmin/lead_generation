import ErrorValidationMessage from '../ErrorValidation';
import { PhoneNumberProps } from '../../interfaces/formFields';
import { Controller } from 'react-hook-form';

export const PhoneNumberInput = (inputProps: Readonly<PhoneNumberProps>) => {
  const {
    label,
    name,
    control,
    error,
    sizeMax = 0,
    sizeMin = 0,
    placeholder = '',
    required = false,
    disabled = false,
    className = '',
    onChange,
    readOnly = false,
    countryCode,
    format,
    maxLength,
  } = inputProps;

  return (
    <div className={`form-control phone-number-input`}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="field">
            {countryCode && <label className="country-code">{countryCode}</label>}
            <input
              className={`${className} ${error ? 'field-error' : ''} ${
                countryCode ? 'input-with-country-code' : ''
              }`}
              type={'text'}
              id={name}
              autoComplete="off"
              placeholder={placeholder}
              {...field}
              disabled={disabled}
              maxLength={maxLength ? maxLength : 100}
              onFocus={() => {}}
              onBlur={() => {}}
              onChange={(event) => {
                const value = formatOnInput(event.target.value, format);
                field.onChange(value);
                onChange?.(value);
              }}
              readOnly={readOnly}
            />
            {label && (
              <label className={`input-label`} htmlFor={name}>
                {label}
                {required && <span className={countryCode ? 'required' : ''}>*</span>}
              </label>
            )}
          </div>
        )}
      />

      {error && (
        <ErrorValidationMessage
          errors={error}
          name={label?.toLowerCase()}
          sizeMax={sizeMax}
          sizeMin={sizeMin}
        />
      )}
    </div>
  );
};

export function formatOnInput(input: string, format: number[]) {
  let digits = input.replace(/\D/g, '');
  let formatted = '';
  let position = 0;

  for (let i = 0; i < format.length; i++) {
    let groupSize = format[i];
    if (digits.length > position) {
      if (formatted.length > 0) formatted += ' ';
      formatted += digits.slice(position, position + groupSize);
      position += groupSize;
    }
  }

  return formatted;
}
