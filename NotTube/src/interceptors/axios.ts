import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL+"/api/" || "http://localhost:3000/api/";
axios.defaults.withCredentials = true;

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post("auth/refresh", {
          refreshToken: localStorage.getItem("refresh_token"),
        });
        console.log(data.accessToken);
        localStorage.setItem("access_token", data.accessToken);
        processQueue(null, data.accessToken);

        return axios(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    if (error.response?.status === 401) {
      // Clear tokens and redirect to login if unauthorized
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default axios;
