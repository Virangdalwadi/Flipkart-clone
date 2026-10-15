import { useState, useEffect } from "react";
import { searchProducts } from "../api/Productapi";

const useProductSuggestions = (query, limit = 6) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const search = query?.trim();
    if (!search) {
      setSuggestions([]);
      setLoading(false);
      setError("");
      return;
    }

    setSuggestions([]);
    setLoading(true);
    setError("");
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const products = await searchProducts(search, {
          limit,
          signal: controller.signal,
        });
        setSuggestions(products);
      } catch (requestError) {
        if (requestError.name !== "CanceledError" && requestError.code !== "ERR_CANCELED") {
          console.error("Suggestion fetch failed:", requestError);
          setSuggestions([]);
          setError("Unable to load suggestions.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250); // debounce

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, limit]);

  return { suggestions, loading, error };
};

export default useProductSuggestions;
