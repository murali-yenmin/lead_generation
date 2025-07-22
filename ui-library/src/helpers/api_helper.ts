import axios from 'axios';

export let axiosApi = axios.create({
  timeout: 25000,
});

let baseURL = '';

export function setApiBaseUrl(url: string) {
  baseURL = url;
  axiosApi.defaults.baseURL = url;
  return url;
}

export async function get(url: string, config = {}) {
  return await axiosApi.get(url, { ...config }).then((response) => response.data);
}

export async function post(url: string, data?: any, config = {}) {
  return axiosApi.post(url, { ...data }, { ...config }).then((response) => response.data);
}

export async function put(url: string, data?: any, config = {}) {
  return axiosApi.put(url, { ...data }, { ...config }).then((response) => response.data);
}

export async function del(url: string, config = {}) {
  return await axiosApi.delete(url, { ...config }).then((response) => response.data);
}

export function clearToken() {
  axiosApi.defaults.headers.common['Authorization'] = '';
}

export function setToken(accessToken: string) {
  axiosApi.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
}

export function axiosInstance() {
  return axiosApi;
}
