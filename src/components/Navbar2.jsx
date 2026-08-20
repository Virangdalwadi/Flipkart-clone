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
    // setValue("");
    navigate("/");
  }

  function handleSports() {
    const value = "Sports";
    handleFormSubmit(value)
  }

  return (
    <>
      <div className="w-full bg-white fixed z-10 ">
        <div className="max-w-6xl m-auto p-auto ">
          <div>
            <div className=" flex  justify-between items-center p-3 ">
              <div className="flex flex-row gap-3">
                <div className="flex justify-center rounded-xl items-center p-6 h-8 w-40 bg-[#ffe51f]">
                  <img className="size-7 mr-1" src={logo} />
                  <img className="h-5 w-15" src={name} />
                </div>
                <div className="flex cursor-pointer justify-center rounded-xl items-center p-6 h-8 w-40 bg-slate-200">
                  <img className="size-7 mr-1" src={Aeroplane} />
                  <img className="h-5 w-10" src={travel} />
                </div>
              </div>
              <div className="flex gap-2">
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

          <div className="flex items-center justify-between p-2">
            <div className="felx flex-row">
              <SearchBar
                value={search}
                onChange={setSearch}
                onSubmitSuccess={handleFormSubmit}
                onClear={handleBack}
              />
            </div>
            <div className=" flex flex-row flex-wrap w-100 items-center justify-end" >

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




