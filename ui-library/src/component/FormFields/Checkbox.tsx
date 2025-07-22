import { CheckboxProps } from '../../interfaces/formFields';
import ErrorValidationMessage from '../ErrorValidation';
import { Controller } from 'react-hook-form';
import CheckBoxTick from '../Images/CheckBoxTick';

export const Checkbox = (checkboxProps: Readonly<CheckboxProps>) => {
  const {
    label,
    name,
    control,
    error,
    required = false,
    parentClassName = '',
    labelClassName = '',
    defaultSelected = false,
    disabled = false,
    onChange,
  } = checkboxProps;

  return (
    <div className={parentClassName}>
      <div className="d-flex">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <div>
              <label
                htmlFor={`${name}`}
                className={`custom-checkbox ${disabled ? 'disabled' : ''}`}
              >
                <input
                  id={name}
                  type="checkbox"
                  defaultChecked={defaultSelected}
                  {...field}
                  disabled={disabled}
                  onChange={(e) => {
                    field.onChange(e);
                    onChange?.(e.target.checked);
                  }}
                />
                <span className={`checkMark ${field.value ? 'checked' : ''}`}>
                  {field.value && <CheckBoxTick />}
                </span>
              </label>
            </div>
          )}
        />
        {label && (
          <label htmlFor={name} className={labelClassName}>
            {label}
            {required && <span>*</span>}
          </label>
        )}
        {error && <ErrorValidationMessage errors={error} name={label?.toLowerCase()} />}
      </div>
    </div>
  );
};
