import ErrorValidationMessage from './ErrorValidation';
import { Controller } from 'react-hook-form';
import { useState } from 'react';
import { InputProps } from '../interfaces/formFields';
import Visa from '../assets/Visa';
import { getCardType } from '../utils/getCardType';
import Master from '../assets/Master';
import Amex from '../assets/Amex';
import Discover from '../assets/Discover';
import UnionPay from '../assets/UnionPay';
import Diners from '../assets/Diners';
import Jcb from '../assets/Jcb';
import CardIcon from '../assets/CardIcon';

export const CardNumber = (inputProps: Readonly<InputProps>) => {
  const [cardName, setCardName] = useState('default');
  const {
    label,
    name,
    type = 'text',
    control,
    error,
    sizeMax = 0,
    sizeMin = 0,
    placeholder = '',
    required = false,
    disabled = false,
    className = '',
    onChange,
  } = inputProps;

  const formatCardNumber = (value: string) => {
    // Remove non-numeric characters
    const cleaned = value.replace(/\D/g, '');

    // Limit to 16 digits
    const truncated = cleaned.slice(0, 19);

    // Format as XXXX XXXX XXXX XXXX
    return truncated.replace(/(\d{4})/g, '$1 ').trim();
  };

  return (
    <div className={`form-control`}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <input
              className={`${className} ${error ? 'field-error' : ''}`}
              type={type}
              id={name}
              autoComplete="off"
              placeholder={placeholder}
              {...field}
              disabled={disabled}
              onChange={(event) => {
                const value = formatCardNumber(event.target.value);
                field.onChange(value);
                onChange?.(value);
                setCardName(getCardType(value));
              }}
            />
            {label && (
              <label className={`input-label`} htmlFor={name}>
                {label}
                {required && <span>*</span>}
              </label>
            )}
            <div className="card-logo">
              {cardName === 'visa' && <Visa />}
              {cardName === 'mastercard' && <Master />}
              {cardName === 'amex' && <Amex />}
              {cardName === 'discover' && <Discover />}
              {cardName === 'jcb' && <Jcb />}
              {cardName === 'diners' && <Diners />}
              {cardName === 'unionpay' && <UnionPay />}
              {cardName === 'default' && <CardIcon />}
            </div>
          </>
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
