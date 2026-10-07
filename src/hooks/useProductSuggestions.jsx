import { useState, useEffect } from "react";
import axios from "axios";

const useProductSuggestions = (query, baseUrl, limit = 6) => {

  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!query || !query.trim()) {
      setSuggestions((current) => current.length ? [] : current);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(`${baseUrl}?q=${query}&limit=${limit}`, {
          signal: controller.signal,
        });
        setSuggestions(res.data.products || []);
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error("Suggestion fetch failed:", err);
        }
      }
    }, 250); // debounce

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, baseUrl, limit]);

  return { suggestions };
};

export default useProductSuggestions;
