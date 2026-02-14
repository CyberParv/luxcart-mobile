import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export function useWishlist() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWishlist = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/v1/wishlist');
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return { data, isLoading, error, refetch: fetchWishlist };
}
