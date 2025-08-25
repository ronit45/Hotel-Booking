import api from "../utils/axios";
import { useEffect, useState, useCallback } from "react";

const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // useCallback so fetchData doesn't get re-created on every render
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
  const res = await api.get(url);
  setData(res.data);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  }, [url]);

  // fetch data on initial load and when url changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, reFetch: fetchData };
};

export default useFetch;
