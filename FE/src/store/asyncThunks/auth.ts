import { createAsyncThunk } from '@reduxjs/toolkit';
import { toastError } from 'UI-Library';
import { signIn } from '../../helpers/backend_helper';
import axios from 'axios';

//Sign In
export const signinUser = createAsyncThunk(
  'user/signinUser',
  async ({ loginData, navigateAfterSignin, backToVerify }: any) => {
    try {
      const response = await signIn(loginData);
      if (response?.access_token) {
        navigateAfterSignin(response?.access_token ?? '');
      } else {
        toastError('werwer waeraweraw');
      }

      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toastError(error?.response?.data?.message);
        if (error?.response?.data?.data?.is_email_verified === false) {
          backToVerify();
        }
      }
      return error;
    }
  },
);
