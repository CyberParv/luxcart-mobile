import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export function useOrderDetail(id) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrderDetail = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/v1/orders/${id}`);
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrderDetail();
  }, [id]);

  return { data, isLoading, error, refetch: fetchOrderDetail };
}
