import { Controller } from 'react-hook-form';
import ErrorValidation from '../ErrorValidation';
import { RadioProps } from '../../interfaces/formFields';

export const Radio = ({
  label,
  name,
  options,
  control,
  error,
  required = false,
  onChange,
}: RadioProps) => {
  return (
    <div className="radioBtn">
      <label className="label">
        {label}
        {required && <span>*</span>}
      </label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="radio-item-wrapper">
            {options.map((option, index) => (
              <label className="radioField" key={`${name}-${index}`}>
                <div className={`customRadio ${field.value === option.value ? 'checked' : ''}`}>
                  <input
                    type="radio"
                    value={option.value}
                    checked={field.value === option.value}
                    onChange={() => {
                      field.onChange(option.value);
                      onChange?.(option.value);
                    }}
                  />
                  <span className="checked-field">
                    <span className="checked-style"></span>
                  </span>
                </div>
                {option.label}
              </label>
            ))}
          </div>
        )}
      />

      {error && <ErrorValidation errors={error} name={label?.toLowerCase()} />}
    </div>
  );
};
