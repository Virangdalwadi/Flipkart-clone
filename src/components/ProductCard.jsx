import React, { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import axios from "axios";
import "../style.css";
import Loader from "./Loader";
import Footer from "./Footer";
import { NavLink } from "react-router-dom";

const ProductCard = ({ query }) => {

  const [search, setSearch] = useState('');
  const [btn, setBtn] = useState(JSON.parse(localStorage.getItem('Pros')) || []);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [item, setItem] = useState(JSON.parse(localStorage.getItem('Pros')) || []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const api = `https://dummyjson.com/products/search?q=${query}`;
        const response = await axios.get(api);
        setProducts(response.data.products || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    setTimeout(() => {
      fetchData();
    }, 100);
  }, [query]);

  const handleSearchSubmit = () => {
    const trimmed = search.trim();
    setQuery(trimmed.length > 0 ? trimmed : "");
  };

  const handleUndoDisplay = (e) => {
    const value = e.target.value;

    setSearch("");
    if (value === "") {
      console.log("Search input was cleared via the cancel button!");
      query("");
    }
  };


  const handleAddtoCart = (product) => {

    const updatedproductData = {
      ...product,
      btn_id: product.id
    }

    console.log("Adding to cart", updatedproductData);

    setItem([...item, updatedproductData])
    localStorage.setItem("Products", JSON.stringify([...item, updatedproductData]));

    alert("Added to Cart");

  }
  // console.log(btn);

  const handleGotoCart = (product) => {
    setBtn(true);
    console.log(product.id);
  }

  return (
    <>
      <div className="flex justify-center mb-4">
        {/* <SearchBar onSubmitSuccess={handleFormSubmit} /> */}
        {/* {query && <button
          className="flex text-center bg-red-600 px-3 py-1 mt-3.5 text-white rounded-md"
          onClick={handleUndoDisplay}
        >
          Clear
        </button>} */}
      </div>
      {loading ? (
        <div className="flex h-[70vh] justify-center items-center">
          <Loader />
        </div>
      ) : products.length === 0 ? (
        <div className="flex h-[70vh] items-center justify-center">
          <p className="text-center text-3xl">No products found</p>
        </div>
      ) : (
        <div className="flex relative felx-wrap items-center justify-center px-1 mb-10 mt-10">
          <div className="flex flex-wrap gap-x-4 gap-y-4 max-w-7xl m-auto p-auto   ">
            {products.map((product) => (
              <div key={product.id} className="w-60 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden group">
                <div className="relative overflow-hidden aspect-square bg-gray-100">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-in-out"
                  />
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider">
                    Sale
                  </span>
                </div>

                <div className="p-5">
                  <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">
                    {product.category}
                  </p>

                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {product.title}
                  </h3>

                  <div className="flex   items-center mt-2.5 mb-4">
                    <div className="flex text-amber-400 space-x-0.5">
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span className="text-gray-300">★</span>
                    </div>
                    <span className="bg-blue-50 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded ml-3">
                      4.0
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xl font-extrabold text-gray-900">
                        ${product.price}
                      </span>
                      <span className="text-sm text-gray-400 line-through">${(product.price + ((2 / 5) * 10)).toFixed(2)}</span>
                    </div>

                    {
                      !item.includes(product.btn_id) || item === product.id ?
                        <button className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4  font-medium rounded-xl text-sm px-3 py-2 transition-colors focus:outline-none" onClick={() => handleAddtoCart(product)}>
                          Add to Cart
                        </button>
                        :
                        <NavLink to="/pages/cart">
                          <button className="text-white bg-green-600 hover:bg-green-700 focus:ring-4  font-medium rounded-xl text-sm px-3 py-2 transition-colors focus:outline-none" onClick={() => handleGotoCart(product)}>Go to Cart</button></NavLink>
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


      )}
      <Footer />

    </>
  );
};

export default ProductCard;



