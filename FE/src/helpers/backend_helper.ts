import * as url from './url_helper';
import { del, get, post, put, setApiBaseUrl } from 'UI-Library';
import {
  ForgotPwdFormInputs,
  LoginFormInputs,
  ResendOtpInput,
  ProfilePasswordProps,
  ResetPwdFormInputs,
} from '../interfaces/components';

const baseURL = setApiBaseUrl(process.env.REACT_APP_BACKEND_URL ?? '');

// Auth
export const signIn = (data: LoginFormInputs) => post(`${baseURL}/${url.SIGNIN}`, data);
export const forgotPassword = (data: ForgotPwdFormInputs) =>
  post(`${baseURL}/${url.FORGOT_PASSWORD}`, data);
export const resetPassword = (data: ResetPwdFormInputs) =>
  post(`${baseURL}/${url.RESETPASSWORD}`, data);
export const resendOtp = (data: ResendOtpInput) => post(`${baseURL}/${url.RESEND_OTP}`, data);
export const signupTerms = () => put(`${baseURL}/${url.SIGNUP_TERMS}`);

// user
export const getUser = () => get(`${baseURL}/${url.GET_USER}`);

//Profile
export const changePassword = (data: ProfilePasswordProps) =>
  post(`${baseURL}/${url.RESET_PASSWORD}`, data);
export const updateProfileImg = (data: { files: File }) =>
  put(`${baseURL}/${url.PROFILE_IMG}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
export const deleteProfileImg = () => del(`${baseURL}/${url.PROFILE_IMG}`);
