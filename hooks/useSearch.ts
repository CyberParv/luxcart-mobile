import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export function useSearch(query) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSearchResults = async () => {
    if (!query) return;
    setIsLoading(true);
    try {
      const response = await api.get(`/v1/products?q=${query}`);
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResults();
  }, [query]);

  return { data, isLoading, error, refetch: fetchSearchResults };
}
