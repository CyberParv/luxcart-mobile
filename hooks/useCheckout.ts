import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export function useCheckout() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/v1/checkout');
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckout();
  }, []);

  return { data, isLoading, error, refetch: fetchCheckout };
}
