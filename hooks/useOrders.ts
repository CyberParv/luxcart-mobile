import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export function useOrders() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/v1/orders');
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { data, isLoading, error, refetch: fetchOrders };
}
