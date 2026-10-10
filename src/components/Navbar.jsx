import React, { useState, useEffect } from "react";

// Pages
// Font Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

// Images
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/images/Logo/logo.webp";
import name from "../assets/images/Logo/name.webp";
import Aeroplane from "../assets/images/Logo/Aeroplane.webp";
import travel from "../assets/images/Logo/travel.webp";
import nav1 from "../assets/images/Navbar-svg/nav1.svg";
import nav2 from "../assets/images/Navbar-svg/nav2.svg";
import nav3 from "../assets/images/Navbar-svg/nav3.svg";
import nav4 from "../assets/images/Navbar-svg/nav4.svg";
import nav5 from "../assets/images/Navbar-svg/nav5.svg";
import nav6 from "../assets/images/Navbar-svg/nav6.svg";
import nav7 from "../assets/images/Navbar-svg/nav7.svg";
import nav8 from "../assets/images/Navbar-svg/nav8.svg";
import nav9 from "../assets/images/Navbar-svg/nav9.svg";
import nav10 from "../assets/images/Navbar-svg/nav10.svg";
import nav11 from "../assets/images/Navbar-svg/nav11.svg";
import nav12 from "../assets/images/Navbar-svg/nav12.svg";
import nav13 from "../assets/images/Navbar-svg/nav13.svg";
import nav14 from "../assets/images/Navbar-svg/nav14.svg";
import "../style/App.css";
import SearchBar from "./SearchBar";
import { useAuth } from "../context/AuthContext";
import useProductSuggestions from "../hooks/useProductSuggestions"; // add this import
// import api from "../api/Addressapi.js";


const Navbar = ({ setValue, initialSearch = "" }) => {

  const [search, setSearch] = useState(initialSearch);
  const { user, logout } = useAuth();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const { suggestions } = useProductSuggestions(search, baseUrl);
  const navigate = useNavigate();

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);


  const handleFormSubmit = (value) => {
    const trimmed = (value || "").trim();
    setSearch(trimmed);
    if (setValue) setValue(trimmed); // this drives ProductCard's query in the parent
  };

  const handleSearchClear = () => {
    setSearch("");
    if (setValue) setValue("");
  };


  // console.log()

  // ForYou Navigation
  const handleForyou = () => {
    window.scrollTo(0, 0);
    const value = "";
    navigate("/")
    handleFormSubmit(value)
  }

  // Fashon Navigation
  const handleFashion = () => {
    window.scrollTo(0, 0);
    const value = "shirt"
    handleFormSubmit(value)
  }

  // Mobile Navigation
  const handleMobile = () => {
    window.scrollTo(0, 0);
    const value = "Phone";
    handleFormSubmit(value)
  }

  // Electronics Navigation
  const handleElectronics = () => {
    window.scrollTo(0, 0);
    const value = "Laptop";
    handleFormSubmit(value)
  }

  // Beauty Navigation
  const handleBeauty = () => {
    window.scrollTo(0, 0);
    const value = "makeup";
    handleFormSubmit(value)
  }

  // Home Navigation
  const handleHome = () => {

    window.scrollTo(0, 0);
    const value = 'home'
    handleFormSubmit(value);

  }

  // Home Navigation
  const handlAuto = () => {

    window.scrollTo(0, 0);
    const value = 'helmet'
    handleFormSubmit(value);

  }

  // Furniture Navigation
  const handleFurniture = () => {
    window.scrollTo(0, 0);
    const value = "Sofa";
    handleFormSubmit(value);
  }

  // 2 wheels Navigation
  function handleTwowheels() {
    window.scrollTo(0, 0);
    const value = "Motorcycle";
    handleFormSubmit(value)
  }

  function handleBack() {
    setSearch("");
    if (setValue) setValue("");
  }
  const handleHomenavigation = () => {
    if (setValue) setValue("");
    navigate("/");
  }

  function handleSports() {
    window.scrollTo(0, 0);
    const value = "sports-accessories";
    handleFormSubmit(value)
  }

  function handleAppliances() {
    window.scrollTo(0, 0);
    handleFormSubmit("kitchen");
  }

  function handleToys() {
    window.scrollTo(0, 0);
    handleFormSubmit("toys");
  }

  function handleFood() {
    window.scrollTo(0, 0);
    handleFormSubmit("groceries");
  }

  function handleBooks() {
    window.scrollTo(0, 0);
    handleFormSubmit("books");
  }
  return (
    <>
      <div className="fixed inset-x-0 top-0 z-10 w-full bg-white shadow-sm">
        <div className="mx-auto w-full max-w-6xl px-3 sm:px-4">
          <div className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between ">
            <div className="flex min-w-0 flex-row gap-2 sm:gap-3">
              <div className="flex py-3 min-w-0 flex-1 cursor-pointer items-center justify-center rounded-xl bg-[#ffe51f] px-3 sm:w-40 sm:flex-none sm:px-6">
                <img width="28" height="28" className="size-7 mr-1" src={logo} alt="flipkart logo" />
                <img width="60" height="20" className="h-5 w-15" src={name} alt="flipkart logo text" />
              </div>
              <div className="flex min-w-0 flex-1 cursor-pointer items-center justify-center rounded-xl bg-slate-200 px-3 sm:w-40 sm:flex-none sm:px-6">
                <img width="28" height="28" className="size-7 mr-1" src={Aeroplane} alt="Aeroplane logo" />
                <img width="40" height="20" className="h-5 w-10" src={travel} alt="Aeroplane logo text" />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm sm:justify-end">
              <h2 className="font-semibold">
                <span>
                  <FontAwesomeIcon icon={faLocationDot} />
                </span>
                Location Not on set
              </h2>
              <span className="text-blue-600 font-semibold flex items-center gap-1">
                Select delivery location
                <span>
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 17 17"
                    style={{ backgroundColor: "rgba(0,0,0,0.00)" }}
                  >
                    <path
                      d="m6.627 3.749 5 5-5 5"
                      stroke="#1254E7"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 pb-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full min-w-0 sm:flex-1">
              <SearchBar
                value={search}
                onChange={setSearch}
                onSubmitSuccess={handleFormSubmit}
                onClear={handleSearchClear}
                suggestions={suggestions}
              />

            </div>

            <div className="flex w-full items-center justify-start sm:w-auto sm:justify-end">

              <div className="flex w-full sm:w-auto">

                <NavLink to="/">
                  <button className="ml-2 cursor-pointer rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4" onClick={handleHomenavigation}>Home</button>
                </NavLink>
                {user ? (
                  <>
                    <NavLink to="/pages/profile">
                      <button className="ml-2 cursor-pointer rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4">Profile</button>
                    </NavLink>
                    <button onClick={async () => { await logout(); navigate("/"); }} className="ml-2 cursor-pointer rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4">Logout</button>
                  </>
                ) : (
                  <>
                    <NavLink to="/pages/login" state={{ mode: "login" }}>
                      <button className="ml-2 cursor-pointer rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4">Login</button>
                    </NavLink>
                    <NavLink to="/pages/login" state={{ mode: "register" }}>
                      <button className="ml-2 cursor-pointer rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4">Register</button>
                    </NavLink>
                  </>
                )}

                <NavLink to="/pages/Cart">
                  <button className="ml-2 cursor-pointer rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4">Cart</button>
                </NavLink>
              </div>
            </div>
          </div>
          <div>

            <div className="scrollbar-hide flex cursor-pointer gap-1 overflow-x-auto px-1 pb-2 sm:px-5">
              <ul className="flex">
                <li
                  onClick={handleForyou}
                  className="flex cursor-pointer flex-col items-center px-2.5 hover:underline"
                >
                  <img width="32" height="32" src={nav1} alt="For You" />
                  <span>For_You</span>
                </li>

                <li
                  onClick={handleFashion}
                  className="flex cursor-pointer flex-col items-center px-2.5 hover:underline"
                >
                  <img width="32" height="32" src={nav2} alt="Fashion" />
                  <span>Fashion</span>
                </li>

                <li
                  onClick={handleMobile}
                  className="flex cursor-pointer flex-col items-center px-2.5 hover:underline"
                >
                  <img width="32" height="32" src={nav3} alt="Mobiles" />
                  <span>Mobiles</span>
                </li>

                <li
                  onClick={handleElectronics}
                  className="flex cursor-pointer flex-col items-center px-2.5 hover:underline"
                >
                  <img width="32" height="32" src={nav4} alt="Electronics" />
                  <span>Electronics</span>
                </li>

                <li
                  onClick={handleBeauty}
                  className="flex cursor-pointer flex-col items-center px-2.5 hover:underline"
                >
                  <img width="32" height="32" src={nav6} alt="Beauty" />
                  <span>Beauty</span>
                </li>

                <li
                  onClick={handleHome}
                  className="flex cursor-pointer flex-col items-center px-2.5 hover:underline"
                >
                  <img width="32" height="32" src={nav5} alt="Home" />
                  <span>Home</span>
                </li>

                <li
                  onClick={handleAppliances}
                  className="flex cursor-pointer flex-col items-center px-2.5 hover:underline"
                >
                  <img width="32" height="32" src={nav7} alt="Appliances" />
                  <span>Appliances</span>
                </li>

                <li
                  onClick={handleToys}
                  className="flex cursor-pointer flex-col items-center px-2.5 hover:underline"
                >
                  <img width="32" height="32" src={nav8} alt="Toys" />
                  <span>Toys</span>
                </li>

                <li
                  onClick={handleFood}
                  className="flex cursor-pointer flex-col items-center px-2.5 hover:underline"
                >
                  <img width="32" height="32" src={nav9} alt="Food" />
                  <span>Food</span>
                </li>

                <li
                  onClick={handlAuto}
                  className="flex cursor-pointer flex-col items-center px-2.5 hover:underline"
                >
                  <img width="32" height="32" src={nav10} alt="Auto" />
                  <span>Auto</span>
                </li>

                <li
                  onClick={handleSports}
                  className="flex cursor-pointer flex-col items-center px-2.5 hover:underline"
                >
                  <img width="32" height="32" src={nav11} alt="Sports" />
                  <span>Sports</span>
                </li>

                <li
                  onClick={handleFurniture}
                  className="flex cursor-pointer flex-col items-center px-2.5 hover:underline"
                >
                  <img width="32" height="32" src={nav12} alt="Furniture" />
                  <span>Furniture</span>
                </li>

                <li
                  onClick={handleBooks}
                  className="flex cursor-pointer flex-col items-center px-2.5 hover:underline"
                >
                  <img width="32" height="32" src={nav13} alt="Books" />
                  <span>Books</span>
                </li>

                <li
                  onClick={handleTwowheels}
                  className="flex cursor-pointer flex-col items-center px-2.5 hover:underline"
                >
                  <img width="32" height="32" src={nav14} alt="2 Wheels" />
                  <span>2_Wheels</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
