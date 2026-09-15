import React, { useState } from "react";

// Images
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/Logo/logo.webp";
import name from "../assets/Logo/name.webp";
import SearchBar from "./SearchBar";

const Navbar3 = ({ setValue }) => {

  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleFormSubmit = (value) => {
    if (setValue) setValue(value);
  }

  function handleBack() {
    setSearch("");
    if (setValue) setValue("");
    navigate("/");
    console.log("Navigated Successfully")
  }
  const handleHomenavigation = () => {
    // setValue("");
    navigate("/");
  }

  function handleSports() {
    const value = "Sports";
    handleFormSubmit(value)
  }

  return (
    <>
      <div className="w-full bg-white fixed z-10 top-0 left-0 right-0 border-b border-gray-200 shadow-sm">
        <div className="w-full max-w-full px-2 sm:px-3 md:px-4 lg:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 sm:gap-3 md:gap-4 py-2 sm:py-3">

            {/* Logo Section */}
            <div className="flex flex-row gap-2 sm:gap-3 items-center w-full md:w-auto min-w-0">
              <div className="flex justify-center rounded-lg items-center shrink-0 px-2 sm:px-3 py-1 sm:py-2 h-auto bg-[#ffe51f]">
                <img className="size-5 sm:size-6 mr-1" src={logo} alt="Logo" />
                <img className="h-4 sm:h-5 w-auto" src={name} alt="Brand Name" />
              </div>

              {/* SearchBar - Full width on mobile, auto on desktop */}
              <div className="flex-1 md:flex-initial min-w-0">
                <SearchBar
                  value={search}
                  onChange={setSearch}
                  onSubmitSuccess={handleFormSubmit}
                  onClear={handleBack}
                />
              </div>
            </div>

            {/* Navigation Buttons Section */}
            <div className="flex flex-row gap-1 sm:gap-2 items-center justify-end w-full md:w-auto flex-wrap">
              <NavLink to="/">
                <button
                  className="text-white text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 focus:ring-4 font-medium rounded-md px-2 sm:px-3 py-1 sm:py-1.5 transition-colors focus:outline-none whitespace-nowrap"
                  onClick={handleHomenavigation}
                >
                  Home
                </button>
              </NavLink>
              <NavLink to="/pages/Login">
                <button
                  className="text-white text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 focus:ring-4 font-medium rounded-md px-2 sm:px-3 py-1 sm:py-1.5 transition-colors focus:outline-none whitespace-nowrap"
                >
                  Login
                </button>
              </NavLink>
              <NavLink to="/pages/Cart">
                <button
                  className="text-white text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 focus:ring-4 font-medium rounded-md px-2 sm:px-3 py-1 sm:py-1.5 transition-colors focus:outline-none whitespace-nowrap"
                >
                  Cart
                </button>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar3;

