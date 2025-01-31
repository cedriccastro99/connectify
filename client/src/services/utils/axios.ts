import axios from 'axios';
import { TRequest, TResponse } from '../types';

const timeout = 30000

const BASE_URL = import.meta.env.VITE_BASE_URL

const request = axios.create({
  baseURL: BASE_URL,
  timeout: timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

const makeRequest = async ({ method, url, data, options, signal }: TRequest) => {
  try {

    request.interceptors.request.use(async (config) => {
      const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjc5ODdhM2E2YTMwNGNiM2VlN2I3ZDM0IiwiaWF0IjoxNzM4MTQyNDYyLCJleHAiOjE3MzgyMjg4NjJ9.ycpZmhEdWFfhkOsALIyivrs-bH542PevwQo2bmTDLH8';
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    const response = await request({ method, url, data, ...options, signal });
    return response.data as TResponse;

  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(error.response);
      throw error.response.data.message;
    } else if (axios.isCancel(error)) {
      console.error('Request canceled', error.message)
      throw new Error('The request was canceled');
    } else {
      console.error(error);
      throw new Error('An unknown error occurred');
    }
  }
}

export default makeRequest;