import { useState, useEffect } from "react";
import axios from "axios";

const useProductSuggestions = (query, baseUrl, limit = 6) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    if (!query || !query.trim()) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    setLoadingSuggestions(true);

    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(`${baseUrl}?q=${query}&limit=${limit}`, {
          signal: controller.signal,
        });
        setSuggestions(res.data.products || []);
        console.log("sample suggestion:", (res.data.products || [])[0]);
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error("Suggestion fetch failed:", err);
        }
      } finally {
        setLoadingSuggestions(false);
      }
    }, 250); // debounce

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, baseUrl, limit]);

  return { suggestions, loadingSuggestions };
};

export default useProductSuggestions;
