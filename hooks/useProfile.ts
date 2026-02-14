import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export function useProfile() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/v1/me');
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { data, isLoading, error, refetch: fetchProfile };
}
