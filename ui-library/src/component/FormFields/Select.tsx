import { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import SelectComponent, { components } from 'react-select';
import ErrorValidation from '../ErrorValidation';
import { DropdownProps } from '../../interfaces/formFields';

const CustomSingleValue = (props: any) => {
  const { data, selectProps } = props;
  const isTyping = !!selectProps.inputValue;

  return (
    <components.SingleValue {...props}>
      {isTyping ? (
        <span className="react-select__placeholder">{selectProps.placeholder}</span>
      ) : (
        <>
          <span className="react-select__placeholder">{selectProps.placeholder} </span>
          <span className="custom-selected-value">{data.label}</span>
        </>
      )}
    </components.SingleValue>
  );
};

const CustomInput = (props: any) => {
  const { selectProps, isHidden, innerRef, innerProps } = props;
  const isTyping = !!selectProps.inputValue;

  return (
    <>
      {isTyping && <span className="react-select__placeholder">{selectProps.placeholder}</span>}
      <components.Input
        {...props}
        isHidden={isHidden}
        innerRef={innerRef}
        innerprops={{
          ...innerProps,
        }}
      />
    </>
  );
};

const CustomOption = (props: any) => {
  const { data, innerRef, innerProps, isSelected, isFocused } = props;

  const customStyles = {
    backgroundColor: isSelected ? '#0075c3' : isFocused ? '#eff8ff' : 'transparent',
    color: isSelected ? '#fff' : '#000',
    padding: '12px',
    cursor: 'pointer',
  };

  return (
    <div ref={innerRef} {...innerProps} style={customStyles} className="react-select__option">
      {data.label}
    </div>
  );
};

export const Select = ({
  disabled,
  options,
  control,
  name,
  label,
  error,
  required = false,
  searchable = true,
  placeholder = 'Select option',
  onSelect,
  multiselect = false,
  innerRef,
  defaultValue,
}: DropdownProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');

  return (
    <div className={`form-control ${error && !disabled ? 'field-error' : ''}`}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const handleChange = (selected: any) => {
            if (multiselect) {
              const values = selected ? selected.map((s: any) => s.value) : [];
              field.onChange(values);
              onSelect?.(selected);
            } else {
              field.onChange(selected?.value || '');
              onSelect?.(selected);
            }
          };

          const getValue = () => {
            if (multiselect) {
              if (Array.isArray(field.value) && field.value.length > 0) {
                return options.filter((opt) => field.value.includes(opt.value));
              } else if (!disabled && Array.isArray(defaultValue) && defaultValue.length > 0) {
                return options.filter((opt) => defaultValue.includes(opt.value));
              }
              return [];
            } else {
              const selected = options.find((opt) => opt.value === field.value);
              if (selected) return selected;
              if (defaultValue && !disabled)
                return options.find((opt) => opt.value === defaultValue) || null;
              return null;
            }
          };

          const hasValue = multiselect
            ? Array.isArray(field.value) && field.value.length > 0
            : !!field.value;
          useEffect(() => {
            if (!field.value || (Array.isArray(field.value) && field.value.length === 0)) {
              if (
                multiselect &&
                !disabled &&
                Array.isArray(defaultValue) &&
                defaultValue.length > 0
              ) {
                const defaultValues = options
                  .filter((opt) => defaultValue.includes(opt.value))
                  .map((opt) => opt.value);
                field.onChange(defaultValues);
              } else if (!multiselect && defaultValue && !disabled) {
                field.onChange(defaultValue);
              }
            }
          }, [defaultValue, field, multiselect, options]);

          return (
            <SelectComponent
              ref={innerRef}
              isMulti={multiselect}
              isDisabled={disabled}
              isSearchable={searchable}
              options={options}
              placeholder={`${label || placeholder} ${required ? '*' : ''}`}
              value={getValue()}
              inputValue={inputValue}
              onInputChange={(value: string) => {
                setInputValue(value);
              }}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`react-select-container ${
                (!isFocused && hasValue) || inputValue ? 'react-select__control--is-focused' : ''
              }`}
              classNamePrefix="react-select"
              components={{
                Input: CustomInput,
                SingleValue: CustomSingleValue,
                Option: CustomOption,
              }}
            />
          );
        }}
      />
      {error && !disabled && <ErrorValidation errors={error} name={label?.toLowerCase()} />}
    </div>
  );
};
