import axios, { InternalAxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env["VITE_CONFIG_URL"],
  timeout: 100000,
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

export default axiosInstance;
