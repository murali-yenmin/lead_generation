import { CheckboxGroupProps } from '../../interfaces/formFields';
import ErrorValidation from '../ErrorValidation';
import { Controller } from 'react-hook-form';
export const CheckboxGroup = ({
  label,
  name,
  options,
  onChange,
  control,
  error,
  required = false,
}: CheckboxGroupProps) => {
  // Method to toggle checkbox selection
  const toggleCheckbox = (fieldValue: string[], optionValue: string) => {
    return fieldValue.includes(optionValue)
      ? fieldValue.filter((v) => v !== optionValue) // Remove if exists
      : [...fieldValue, optionValue]; // Add if not exists
  };

  return (
    <div>
      <label htmlFor={name}>
        {label}
        {required && <span>*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div>
            {options.map((option, index) => {
              const isChecked = field.value?.includes(option.value) || false;
              const handleChange = () => {
                const newValue = toggleCheckbox(field.value ?? [], option.value);
                field.onChange(newValue);
                onChange?.(newValue);
              };
              return (
                <label key={`${name}-${index}`}>
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={isChecked}
                    onChange={handleChange}
                  />
                  {option.label}
                </label>
              );
            })}
          </div>
        )}
      />
      {error && <ErrorValidation errors={error} name={label?.toLowerCase()} />}
    </div>
  );
};
