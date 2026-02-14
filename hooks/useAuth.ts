import { useState } from 'react';
import { api } from '@/lib/api';
import { getSecureItem, setSecureItem } from '@/lib/secureStorage';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await api.post('/v1/auth/login', { email, password });
      await setSecureItem('refreshToken', response.data.refreshToken);
      // Store accessToken in memory
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email, password, name) => {
    setIsLoading(true);
    try {
      const response = await api.post('/v1/auth/signup', { email, password, name });
      await setSecureItem('refreshToken', response.data.refreshToken);
      // Store accessToken in memory
    } finally {
      setIsLoading(false);
    }
  };

  return { login, signup, isLoading };
}
