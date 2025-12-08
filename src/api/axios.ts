import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { API_CONFIG } from "@/util/constants";

const COOKIE_CONSENT_KEY = 'joga-aurora-cookie-consent';

// Cache do estado de consentimento para evitar leituras repetidas do localStorage
let consentCache: boolean | null = null;

// Função para verificar consentimento
function hasUserConsent(): boolean {
  if (consentCache !== null) {
    return consentCache;
  }
  try {
    consentCache = localStorage.getItem(COOKIE_CONSENT_KEY) === 'true';
  } catch (error) {
    // Fallback se localStorage não estiver disponível
    console.warn('localStorage não disponível:', error);
    consentCache = false;
  }
  return consentCache;
}

// Atualiza cache quando consentimento é concedido
window.addEventListener('cookie-consent:granted', () => {
  consentCache = true;
});

// Também monitora mudanças no localStorage (para sincronizar entre abas)
window.addEventListener('storage', (e) => {
  if (e.key === COOKIE_CONSENT_KEY) {
    consentCache = e.newValue === 'true';
  }
});

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: false, // Inicia desabilitado
});

// Interceptor de request para configurar withCredentials dinamicamente
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Habilita withCredentials apenas se o usuário consentiu
    config.withCredentials = hasUserConsent();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401 && !window.location.pathname.includes('/login')) {
        // Dispara evento global; AuthProvider lida com navegação
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      }
      if (import.meta.env.DEV) {
        console.error("API Error:", {
          status,
          data: error.response.data,
          url: error.config?.url,
        });
      }
    } else if (error.request) {
      if (import.meta.env.DEV) {
        console.error("Network Error:", error.message);
      }
    } else if (import.meta.env.DEV) {
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
