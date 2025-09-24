// Import axios and InternalAxiosRequestConfig for request configuration type
import { getToken } from "@/lib/auth";
import axios, { InternalAxiosRequestConfig } from "axios";
// Create an axios instance for API calls

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
   const token = getToken();   
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return config;
});

export default API;
