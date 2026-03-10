import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@/auth";
import { isBrowser } from '@/lib/is-browser'

interface CreateAxiosOptions {
  req?: NextApiRequest;
  res?: NextApiResponse;
  ssr?: boolean;
  config?: AxiosRequestConfig;
}

interface CreateAxiosOptionsServer {
  req?: NextApiRequest;
  res?: NextApiResponse;
  ssr?: boolean;
}




export const createAxiosByInterceptors = ({
  req,
  res,
  ssr,
  config,
}: CreateAxiosOptions = {}): AxiosInstance => {
  const instance = axios.create({
    // Timeout configuration
    timeout: 0,
    // Send cookies with cross-origin requests
    withCredentials: true,
    // custom configurations override basic configurations
    ...config,
  });

  // Add request interceptor
  instance.interceptors.request.use(
    async function (config) {
      // Get session and add token to request headers
      const session = (req && res) ? await auth(req, res) : null;

      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }

      return config;
    },
    function (error) {
      // Handle request error
      return Promise.reject(error);
    }
  );

  // Add response interceptor
  instance.interceptors.response.use(
    function (response) {
      // For binary responses, return full response to preserve headers (needed for file downloads)
      if (response.config.responseType === 'arraybuffer' || response.config.responseType === 'blob') {
        return response;
      }

      const { data } = response;

      return data;
    },
    function (error) {
      // Handle response error

      if (error.response) {
        if (ssr) {
          return error;
        }
        if (isBrowser) {
          if (error.response.status === 401) {
            window.location.href = '/login';
          }
        }
      }
      return Promise.reject(error);
    }
  );
  return instance;
};



// API Route & ssr
export const createAxiosByInterceptorsServer = ({
  req,
  res,
  ssr,
}: CreateAxiosOptionsServer = {}) => createAxiosByInterceptors({ req, res, ssr, config: { baseURL: process.env.API_BASE_URL } })

// Client
export const request = createAxiosByInterceptors({ config: { baseURL: process.env.NEXTAUTH_URL } })