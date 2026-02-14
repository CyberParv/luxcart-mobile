import axios, { AxiosError, AxiosRequestConfig } from 'axios';

import { getSecureItem, removeSecureItem, setSecureItem } from '@/lib/secureStorage';

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export const api = axios.create({ baseURL, timeout: 15000 });
export default api;

type Tokens = { accessToken: string; refreshToken: string };

function isAuthExcluded(url?: string) {
  if (!url) return false;
  return url.includes('/auth/login') || url.includes('/auth/signup') || url.includes('/auth/refresh');
}

let refreshPromise: Promise<Tokens> | null = null;

async function refreshTokens(): Promise<Tokens> {
  const refreshToken = await getSecureItem('refreshToken');
  if (!refreshToken) throw new Error('Missing refresh token');

  const res = await axios.post(`${baseURL}/auth/refresh`, { refreshToken }, { timeout: 15000 });
  // Do not rely on api interceptors here.
  const payload = res.data;
  const tokens = payload?.data?.tokens as Tokens;
  if (!tokens?.accessToken || !tokens?.refreshToken) throw new Error('Invalid refresh response');

  await Promise.all([
    setSecureItem('accessToken', tokens.accessToken),
    setSecureItem('refreshToken', tokens.refreshToken)
  ]);

  return tokens;
}

api.interceptors.request.use(async (config) => {
  if (isAuthExcluded(config.url)) return config;

  const token = await getSecureItem('accessToken');
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    // Unwrap AxiosResponse -> return response.data
    return response.data;
  },
  async (error: AxiosError<any>) => {
    const status = error.response?.status;
    const code = error.response?.data?.error?.code;

    const originalConfig = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (status === 401 && code === 'AUTH_TOKEN_EXPIRED' && originalConfig && !originalConfig._retry) {
      originalConfig._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = refreshTokens().finally(() => {
            refreshPromise = null;
          });
        }
        const tokens = await refreshPromise;

        originalConfig.headers = originalConfig.headers ?? {};
        (originalConfig.headers as any).Authorization = `Bearer ${tokens.accessToken}`;

        return api.request(originalConfig);
      } catch (refreshErr) {
        await Promise.all([removeSecureItem('accessToken'), removeSecureItem('refreshToken')]);
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);
