import { DatepickerProps } from '../../interfaces/formFields';
import { Controller } from 'react-hook-form';
import ErrorValidation from '../ErrorValidation';
import { DatePickerInput } from '../DatePickerInput';

export const DatePicker = (props: DatepickerProps) => {
  const {
    onChange,
    id = '',
    name,
    label,
    required,
    control,
    error,
    minDate = undefined,
    disabled = false,
  } = props;

  return (
    <div>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <DatePickerInput
            required={required}
            label={label || ''}
            value={field.value}
            id={id}
            onChange={(value: Date) => {
              field.onChange(value);
              onChange?.(value);
            }}
            minDate={minDate}
            disabled={disabled}
          />
        )}
      />
      {error && <ErrorValidation errors={error} name={label?.toLowerCase()} />}
    </div>
  );
};
