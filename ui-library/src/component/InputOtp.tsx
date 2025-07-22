import OTPInput from 'react-otp-input';
import { InputOtpProps } from '../interfaces/components';
import { useRef } from 'react';

export const InputOtp = ({
  otp,
  setOtp,
  inputStyle = '',
  containerStyle = '',
  afterInputFilled,
}: InputOtpProps) => {
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleChange = (value: string) => {
    setOtp(value);

    if (
      value.length === inputRefs.current.length &&
      document.activeElement === inputRefs.current[inputRefs.current.length - 1]
    ) {
      requestAnimationFrame(() => {
        inputRefs.current[inputRefs.current.length - 1]?.blur();
      });
      setTimeout(() => {
        afterInputFilled?.();
      }, 50);
    }
  };

  return (
    <OTPInput
      value={otp}
      onChange={handleChange}
      numInputs={6}
      shouldAutoFocus={true}
      renderInput={(props, index) => {
        const { ref: originalRef, ...rest } = props;

        return (
          <input
            {...rest}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
            ref={(el) => {
              if (typeof originalRef === 'function') originalRef(el);
              inputRefs.current[index] = el!;
            }}
          />
        );
      }}
      inputType="number"
      inputStyle={`otp-input ${inputStyle}`}
      containerStyle={`otp-input-container ${containerStyle}`}
    />
  );
};
