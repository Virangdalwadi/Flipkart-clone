import React, { useState } from "react";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Home = () => {
  window.scrollTo(0, 0);

  const [value, setValue] = useState('');

  return (
    <>
      <Navbar setValue={setValue} />
      <ProductCard query={value} />
    </>
  );
};

export default Home;
