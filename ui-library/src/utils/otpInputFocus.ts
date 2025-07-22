export const setOtpFocus = () => {
  const otpInputs = document.querySelectorAll('.otp-input-container input');

  for (let i = 0; i < otpInputs.length; i++) {
    const el = otpInputs[i] as HTMLInputElement;
    if (!el.value) {
      el.focus();
      break;
    }
  }
};
