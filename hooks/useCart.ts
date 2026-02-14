import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export function useCart() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/v1/cart');
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return { data, isLoading, error, refetch: fetchCart };
}
