import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export function useProductDetail(id) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProductDetail = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/v1/products/${id}`);
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProductDetail();
  }, [id]);

  return { data, isLoading, error, refetch: fetchProductDetail };
}
