import axios, { InternalAxiosRequestConfig } from "axios";
import axiosRetry from 'axios-retry';

const axiosInstance = axios.create({
  baseURL: import.meta.env["VITE_CONFIG_URL"],
});

// Configure axios-retry
axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: (retryCount) => {
    return retryCount * 1000; // time interval between retries
  },
  retryCondition: (error) => {
    // Retry on network errors or 5xx status codes
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || (error.response && error.response.status >= 500);
  },
});

const excludePaths = ["/user/register", "/user/signin"];

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig<any>) => {
    const isExcludedPath = excludePaths.some((path) =>
      config.url?.includes(path)
    );
    if (!isExcludedPath) {
      const authToken = localStorage.getItem("jwt");
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for logging
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Axios error:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;