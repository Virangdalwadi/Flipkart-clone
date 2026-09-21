import React, { useState } from "react";

// Font Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

// Images
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/Logo/logo.webp";
import name from "../assets/Logo/name.webp";
import Aeroplane from "../assets/Logo/Aeroplane.webp";
import travel from "../assets/Logo/travel.webp";
import "../App.css";
import SearchBar from "./SearchBar";

const Navbar = ({ setValue }) => {

  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleinput = () => {
    console.log(search);
  }

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
    navigate("/");
  }

  function handleSports() {
    const value = "Sports";
    handleFormSubmit(value)
  }

  return (
    <>
      <div className="w-full bg-white fixed z-10 ">
        <div className="mx-auto w-full max-w-6xl px-3 sm:px-4">
          <div>
            <div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 flex-row gap-2 sm:gap-3">
                <div className="flex h-8 min-w-0 flex-1 items-center justify-center rounded-xl bg-[#ffe51f] px-3 sm:w-40 sm:flex-none sm:px-6">
                  <img className="size-7 mr-1" src={logo} />
                  <img className="h-5 w-15" src={name} />
                </div>
                <div className="flex h-8 min-w-0 flex-1 cursor-pointer items-center justify-center rounded-xl bg-slate-200 px-3 sm:w-40 sm:flex-none sm:px-6">
                  <img className="size-7 mr-1" src={Aeroplane} />
                  <img className="h-5 w-10" src={travel} />
                </div>
              </div>
              <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm">
                <h2 className="font-semibold">
                  <span>
                    <FontAwesomeIcon icon={faLocationDot} />
                  </span>
                  Location Not on set
                </h2>
                <span className="text-blue-600 font-semibold">
                  Select delivery location
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pb-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 w-full sm:flex-1">
              <SearchBar
                value={search}
                onChange={setSearch}
                onSubmitSuccess={handleFormSubmit}
                onClear={handleBack}
              />
            </div>
            <div className="flex w-full flex-wrap items-center justify-start sm:w-auto sm:justify-end" >

              <div className="flex">

                <NavLink to="/">
                  <button className="text-white ml-1 bg-blue-600 hover:bg-blue-700 focus:ring-4 font-medium rounded-xl text-sm px-3 py-1.5 transition-colors focus:outline-none" onClick={handleHomenavigation}>Home</button>
                </NavLink>
                <NavLink
                  to="/pages/Login"
                ><button className="text-white ml-1 bg-blue-600 hover:bg-blue-700 focus:ring-4  font-medium rounded-xl text-sm px-3 py-1.5 transition-colors focus:outline-none" >Login</button></NavLink>

                <NavLink
                  to="/pages/Cart">
                  <button className="text-white ml-1 bg-blue-600 hover:bg-blue-700 focus:ring-4 font-medium rounded-xl text-sm px-3 py-1.5 transition-colors focus:outline-none">Cart</button></NavLink>
              </div>
            </div>
          </div>
        </div >
      </div>
    </>
  );
};

export default Navbar;




