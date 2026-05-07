import axios, { AxiosError } from 'axios';

export class ApiError extends Error {
  status?: number;
  detail?: unknown;

  constructor(message: string, status?: number, detail?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}

interface ErrorPayload {
  message?: string;
  detail?: unknown;
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10_000,
});

apiClient.interceptors.request.use((config) => {
  if (import.meta.env.DEV) {
    console.info('[api]', config.method?.toUpperCase(), config.url);
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorPayload>) => {
    const message =
      error.response?.data?.message ||
      (typeof error.response?.data?.detail === 'string'
        ? error.response.data.detail
        : undefined) ||
      error.message ||
      'Something went wrong';

    throw new ApiError(message, error.response?.status, error.response?.data?.detail);
  },
);
