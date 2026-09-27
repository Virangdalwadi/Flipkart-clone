import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("search") || "";

  const [value, setValue] = useState(urlQuery);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Sync internal state when URL search parameter changes
  useEffect(() => {
    setValue(urlQuery);
  }, [urlQuery]);

  const handleQueryChange = (newValue) => {
    const trimmed = (newValue || "").trim();
    setValue(trimmed);
    if (trimmed) {
      setSearchParams({ search: trimmed });
    } else {
      setSearchParams({});
    }
  };

  return (
    <>
      <Navbar setValue={handleQueryChange} initialSearch={value} />
      <ProductCard query={value} />
    </>
  );
};

export default Home;

