import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true, // Ensure cookies are sent with requests
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      console.warn("JWT expired, redirecting to login...");
      window.location.href = "/"; // Redirect user to login page
    }
    return Promise.reject(error);
  }
);

export default api;
