import ErrorValidationMessage from '../ErrorValidation';
import { InputProps } from '../../interfaces/formFields';
import { Controller } from 'react-hook-form';

export const Input = (inputProps: Readonly<InputProps>) => {
  const {
    label,
    name,
    type = 'text',
    control,
    error,
    icon,
    sizeMax = 0,
    sizeMin = 0,
    placeholder = '',
    required = false,
    disabled = false,
    className = '',
    onChange,
    maxLength,
    readOnly = false,
    acceptAlphabetOnly = false,
    acceptNumberOnly = false,
    pasteAllow = true,
    max,
    onBlur,
    value = '',
  } = inputProps;

  return (
    <div className={`form-control`}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="field">
            <input
              className={`${className} ${error ? 'field-error' : ''}`}
              type={type}
              id={name}
              defaultValue={value}
              autoComplete="off"
              placeholder={placeholder}
              {...field}
              max={max}
              maxLength={maxLength ? maxLength : 100}
              disabled={disabled}
              onFocus={() => {}}
              onBlur={() => {
                onBlur?.(field.value);
              }}
              onChange={(event) => {
                let value = event.target.value;
                if (acceptAlphabetOnly) {
                  value = value.replace(/[^a-zA-Z\s]/g, '');
                } else if (acceptNumberOnly || type === 'number') {
                  value = value.replace(/\D/g, '');
                }
                field.onChange(value);
                onChange?.(value);
              }}
              readOnly={readOnly}
              onPaste={(e) => {
                if (!pasteAllow) e.preventDefault();
              }}
            />
            {label && (
              <label className={`input-label`} htmlFor={name}>
                {label}
                {required && <span>*</span>}
              </label>
            )}
            {icon && <div className="input-icon">{icon}</div>}
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
