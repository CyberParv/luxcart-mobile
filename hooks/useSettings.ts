import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export function useSettings() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/v1/settings');
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return { data, isLoading, error, refetch: fetchSettings };
}
