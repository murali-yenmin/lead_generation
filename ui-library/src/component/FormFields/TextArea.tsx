import { Controller } from 'react-hook-form';
import ErrorValidationMessage from '../ErrorValidation';
import { TextAreaProps } from '../../interfaces/formFields';

export const TextArea = ({
  name,
  label,
  control,
  error,
  onChange,
  placeholder = '',
  required = false,
  disabled = false,
  className,
  onBlur,
  max,
  value,
}: TextAreaProps) => {
  return (
    <div className="form-control">
      <Controller
        name={name}
        control={control}
        render={({ field: controllerField }) => (
          <div className="field">
            <textarea
              className={`${className}`}
              id={name}
              autoComplete="off"
              placeholder={placeholder}
              defaultValue={value}
              disabled={disabled}
              {...controllerField}
              onBlur={() => {
                onBlur?.(controllerField.value);
              }}
              maxLength={max ? max : 100}
              onChange={(event) => {
                controllerField.onChange(event.target.value);
                onChange?.(event.target.value);
              }}
            />
            {label && (
              <label htmlFor={label}>
                {label} {required && <span>*</span>}
              </label>
            )}
          </div>
        )}
      />
      {error && <ErrorValidationMessage errors={error} name={label?.toLowerCase()} />}
    </div>
  );
};
