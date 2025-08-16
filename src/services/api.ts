// src/services/api.ts

import axios, { AxiosError, AxiosResponse } from "axios";
import { store } from '@/store/store';


const api = axios.create({
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    console.log("Starting Request:", config);
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("Response Successful:", response);
    return response;
  },
  (error: AxiosError) => {
    console.error("Response Error:", error);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else if (error.request) {
      console.error("Request:", error.request);
    } else {
      console.error("Error Message:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
