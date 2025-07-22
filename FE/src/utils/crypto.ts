// src/utils/cryptoUtils.ts
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'aba36e7cc415bc8562f53349dc469d08a01c037bbed557f869e3be21fe406a13'; // Keep this secret and same on both FE & BE
// const SECRET_KEY = 'password'; // Keep this secret and same on both FE & BE

export interface UserData {
  password: string;
}

// Encrypt password
export const encryptPassword = (password: string): string => {
  return CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
};

// Encrypt user data
export const encryptUserData = (data: UserData): UserData => {
  return {
    ...data,
    password: encryptPassword(data.password),
  };
};

export const DEFAULT_PLACEHOLDER = '--';
