import axios from 'axios';
import { TRequest, TResponse, TUploadRequest } from '@/services/types';

const timeout = 30000

const BASE_URL = import.meta.env.VITE_BASE_URL

const request = axios.create({
  baseURL: BASE_URL,
  timeout: timeout,
  headers: {
    'Content-Type': 'application/json',
  }
});

const makeRequest = async ({ method, url, data, options }: TRequest) => {
  try {

    request.interceptors.request.use(async (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    const response = await request({ method, url, data, ...options });
    return response.data as TResponse;

  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(error.response);
      throw error.response.data.message;
    } else {
      console.error(error);
      throw new Error('An unknown error occurred');
    }
  }
}

export const makeUploadRequest = async ({ url, data }: TUploadRequest) => {
  try {
    const response = await request.post(url, data, {
      headers: {
        'Content-Type':'multipart/form-data'
      }
    });
    return response.data as TResponse;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(error.response);
      throw error.response.data.message;
    } else {
      console.error(error);
      throw new Error('An unknown error occurred');
    }
  }
}

export default makeRequest;