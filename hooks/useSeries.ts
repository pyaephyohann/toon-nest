/**
 * useSeries Hook
 * Series data fetching and mutations
 */

import { useState, useEffect } from "react";

export function useSeries(id?: string) {
  const [series, setSeries] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchSeries(id);
    }
  }, [id]);

  const fetchSeries = async (seriesId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Placeholder for API call
      // Will be implemented with RTK Query in Milestone 9
      setSeries(null);
    } catch (err) {
      setError("Failed to fetch series");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    series,
    isLoading,
    error,
    refetch: () => id && fetchSeries(id),
  };
}

export function useSeriesList(options?: {
  page?: number;
  limit?: number;
  genre?: string;
  search?: string;
}) {
  const [series, setSeries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchSeriesList();
  }, [options]);

  const fetchSeriesList = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Placeholder for API call
      // Will be implemented with RTK Query in Milestone 9
      setSeries([]);
      setTotal(0);
    } catch (err) {
      setError("Failed to fetch series list");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    series,
    isLoading,
    error,
    total,
    refetch: fetchSeriesList,
  };
}
