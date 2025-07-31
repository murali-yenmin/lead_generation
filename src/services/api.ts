import axios, { AxiosError, AxiosResponse } from "axios";

const api = axios.create({
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token (or other headers) to every request
api.interceptors.request.use(
  (config) => {
    // In a real application, you would get the token from local storage or a state manager
    // and add it to the request headers.
    // For now, we'll just log the request.
    console.log("Starting Request:", config);
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle responses and errors globally
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // You can modify the response data here before it's passed to the calling function
    console.log("Response Successful:", response);
    return response;
  },
  (error: AxiosError) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    console.error("Response Error:", error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Request:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error Message:", error.message);
    }
    // You could show a global notification/toast here for all API errors
    return Promise.reject(error);
  }
);
export default api;
