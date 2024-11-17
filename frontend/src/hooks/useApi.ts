import { useState, useEffect } from "react";

export const useApi = <T>(
  apiCall: () => Promise<T | undefined>,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!apiCall) return; // Ensure apiCall is defined
      setLoading(true);
      setError(null);
      try {
        const result = await apiCall();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Call fetchData only once per dependency change
  }, dependencies);

  return { data, loading, error };
};
