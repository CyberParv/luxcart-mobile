import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export function useProducts() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/v1/products');
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { data, isLoading, error, refetch: fetchProducts };
}
