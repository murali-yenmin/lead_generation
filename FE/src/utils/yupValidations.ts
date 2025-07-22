import * as yup from 'yup';

export const loginForm = yup.object().shape({
  email_address: yup
    .string()
    .required()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      `Please enter a valid email format 'example@domain.com`,
    ),
  password: yup.string().required(),
});

export const forgotPwdForm = yup.object().shape({
  email_address: yup
    .string()
    .required()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      `Please enter a valid email format 'example@domain.com`,
    ),
});

export const resetPwdForm = yup.object().shape({
  otp: yup
    .string()
    .test('custom', 'Please enter the 6-digit OTP sent to your email address', (val) => {
      if (val) {
        return true;
      } else {
        return false;
      }
    })
    .test('custom', 'OTP must be 6 digits long', (val) => {
      if (val) {
        if (val.length < 6) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    })
    .required(),
  new_password: yup
    .string()
    .required()
    .matches(/[a-z]/, 'Password must meet the following requirements')
    .matches(/[A-Z]/, 'Password must meet the following requirements')
    .matches(/\d/, 'Password must meet the following requirements')
    .matches(/[!@#$%^&*()_+={}[\]:;"'<>,.?/~`]/, 'Password must meet the following requirements')
    .min(8, 'Please enter a new password that is at least 8 characters long'),
  confirm_password: yup
    .string()
    .required()
    .test(
      'custom',
      'The passwords you entered do not match. Please try again',
      (val, formValues) => {
        if (val === formValues.parent.new_password) {
          return true;
        }
        return false;
      },
    ),
});

export const profilePassword = yup.object().shape({
  current_password: yup
    .string()
    .required()
    .min(8, 'Please enter a new password that is at least 8 characters long')
    .matches(/[a-z]/, 'Password must include at least one lowercase letter (a-z)')
    .matches(/[A-Z]/, 'Password must include at least one uppercase letter (A–Z)')
    .matches(/\d/, 'Password must contain at least one number (0-9)')
    .matches(
      /[!@#$%^&*()_+={}[\]:;"'<>,.?/~`]/,
      'Password must include at least one special character (e.g., !, @, #, $, %, ^, &)',
    ),

  password: yup
    .string()
    .required()
    .min(8, 'Please enter a new password that is at least 8 characters long')
    .matches(/[a-z]/, 'Password must include at least one lowercase letter (a-z)')
    .matches(/[A-Z]/, 'Password must include at least one uppercase letter (A–Z)')
    .matches(/\d/, 'Password must contain at least one number (0-9)')
    .matches(
      /[!@#$%^&*()_+={}[\]:;"'<>,.?/~`]/,
      'Password must include at least one special character (e.g., !, @, #, $, %, ^, &)',
    )
    .test(
      'custom',
      'The new password cannot be the same as the current password',
      function (value) {
        const { current_password } = this.parent;
        return value !== current_password;
      },
    ),

  confirm_password: yup
    .string()
    .required()
    .oneOf([yup.ref('password')], 'Passwords must match New Password'),
});

export const createAdminForm = yup.object().shape({
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  role: yup.string().test('select', 'Please select a role', (value) => {
    if (value) {
      return true;
    }
    return false;
  }),
  phone_number: yup
    .string()
    .required('Phone number is required')
    .min(12, 'Phone number must be exactly 10 digits'),
  email_address: yup
    .string()
    .required()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      `Please enter a valid email format 'example@domain.com`,
    ),
});

export const creditCardForm = yup.object().shape({
  card_name: yup.string().required(),
  category: yup.string().required(),
  bonus_unlock_spend: yup.string().required(),
  bonus_unlock_months: yup.string().required(),
  annual_fee: yup.string().required(),
  sign_on_cashback_bonus: yup.string().required(),
  airmiles: yup.string().nullable(),
  free_nights: yup.string().nullable(),
  cashback_percentage: yup
    .string()
    .required('Cashback percentage is required')
    .test({
      name: 'custom',
      message: 'Cashback percentage must be a number less than or equal to 100',
      test: (value) => {
        const num = parseFloat(value);
        return !isNaN(num) && num <= 100;
      },
      params: {
        type: 'custom',
      },
    }),
  sign_on_bonus_points: yup.string().nullable(),
  offer_details: yup
    .array()
    .of(
      yup.object().shape({
        label: yup.string().required('Offer detail is required'),
      }),
    )
    .min(1, 'At least one offer detail is required'),
});

export const debitCardForm = yup.object().shape({
  card_name: yup.string().required(),
  category: yup.string().required(),
  cashback_percentage: yup.string().required(),
  offer_details: yup
    .array()
    .of(
      yup.object().shape({
        label: yup.string().required('Offer detail is required'),
      }),
    )
    .min(1, 'At least one offer detail is required'),
});
