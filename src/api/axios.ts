import axios, { type AxiosError, type AxiosResponse } from "axios";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

api.interceptors.response.use(
  (response: AxiosResponse) => {
    // console.log("API Response:", response);
    return response;
  },
  (error: AxiosError) => {
    // TODO: Adicionar toasts para feedback de erro
    if (error.response) {
      // console.error("API Error:", error.response);
      if (error.response.status === 401) {
        // Redirecionar para o login se não estiver autenticado
        // window.location.href = "/login";
      }
    } else if (error.request) {
      console.error("Network Error:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
