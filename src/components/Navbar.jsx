import React, { useState } from "react";

// Pages
import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";

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
import nav1 from "../assets/Navbar-svg/nav1.svg";
import nav2 from "../assets/Navbar-svg/nav2.svg";
import nav3 from "../assets/Navbar-svg/nav3.svg";
import nav4 from "../assets/Navbar-svg/nav4.svg";
import nav5 from "../assets/Navbar-svg/nav5.svg";
import nav6 from "../assets/Navbar-svg/nav6.svg";
import nav7 from "../assets/Navbar-svg/nav7.svg";
import nav8 from "../assets/Navbar-svg/nav8.svg";
import nav9 from "../assets/Navbar-svg/nav9.svg";
import nav10 from "../assets/Navbar-svg/nav10.svg";
import nav11 from "../assets/Navbar-svg/nav11.svg";
import nav12 from "../assets/Navbar-svg/nav12.svg";
import nav13 from "../assets/Navbar-svg/nav13.svg";
import nav14 from "../assets/Navbar-svg/nav14.svg";
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

  const handleHome = () => {

    window.scrollTo(0, 0);
    const value = 'home'
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
    navigate("/");
    console.log("Navigated Successfully")
  }
  const handleHomenavigation = () => {
    setValue("");
    navigate("/");
  }

  function handleSports() {
    window.scrollTo(0, 0);
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
                  <button className="text-white ml-1 bg-blue-600 hover:bg-blue-700 focus:ring-4 font-medium rounded-md text-sm px-3 py-1.5 transition-colors focus:outline-none" onClick={handleHomenavigation}>Home</button>
                </NavLink>
                <NavLink
                  to="/pages/Login"
                ><button className="text-white ml-1 bg-blue-600 hover:bg-blue-700 focus:ring-4  font-medium rounded-md text-sm px-3 py-1.5 transition-colors focus:outline-none" >Login</button></NavLink>

                <NavLink
                  to="/pages/Cart">
                  <button className="text-white ml-1 bg-blue-600 hover:bg-blue-700 focus:ring-4 font-medium rounded-md text-sm px-3 py-1.5 transition-colors focus:outline-none">Cart</button></NavLink>
              </div>
            </div>
          </div>
          <div>
            <ul>
              <div className="flex gap-1 px-5 mb-1 cursor-pointer">
                <div onClick={handleForyou} className="px-2.5 flex flex-col items-center underline:none hover:underline">
                  <img src={nav1} />
                  <li className="">For You</li>
                </div>
                <div onClick={handleFashion} className="px-2.5 flex flex-col items-center underline:none hover:underline">
                  <img src={nav2} />
                  <li className="underline:none hover:underline">Fashion</li>
                </div>
                <div onClick={handleMobile} className="px-2.5 flex flex-col items-center underline:none hover:underline">
                  <img src={nav3} />
                  <li className="underline:none hover:underline">Mobiles</li>
                </div>
                <div onClick={handleElectronics} className="px-2.5 flex flex-col items-center underline:none hover:underline">
                  <img src={nav4} />
                  <li className="underline:none hover:underline">Electronics</li>
                </div>
                <div className="px-2.5 flex flex-col items-center underline:none hover:underline">
                  <img src={nav6} />
                  <li className="underline:none hover:underline">Beauty</li>
                </div>
                <div onClick={handleHome} className="px-2.5 flex flex-col items-center underline:none hover:underline">
                  <img className="size-8" src={nav5} />
                  <li className="">Home</li>
                </div>
                <div className="px-2.5 flex flex-col items-center underline:none hover:underline">
                  <img src={nav7} />
                  <li className="underline:none hover:underline">Appliances</li>
                </div>
                <div className="px-2.5 flex flex-col items-center underline:none hover:underline">
                  <img src={nav8} />
                  <li className="underline:none hover:underline">Toys</li>
                </div>
                <div className="px-2.5 flex flex-col items-center underline:none hover:underline">
                  <img src={nav9} />
                  <li className="underline:none hover:underline">Food</li>
                </div>
                <div className="px-2.5 flex flex-col items-center underline:none hover:underline">
                  <img src={nav10} />
                  <li className="underline:none hover:underline">Auto</li>
                </div>
                <div onClick={handleSports} className="px-2.5 flex flex-col items-center underline:none hover:underline">
                  <img src={nav11} />
                  <li className="underline:none hover:underline">Sports</li>
                </div>
                <div onClick={handleFurniture} className="px-2.5 flex flex-col items-center underline:none hover:underline">
                  <img src={nav12} />
                  <li className="underline:none hover:underline">Furniture</li>
                </div>
                <div className="px-2.5 flex flex-col items-center underline:none hover:underline">
                  <img src={nav13} />
                  <li className="underline:none hover:underline">Books</li>
                </div>
                <div onClick={handleTwowheels} className="px-2.5 flex flex-col items-center underline:none hover:underline">
                  <img src={nav14} />
                  <li className="underline:none hover:underline">2 Wheels</li>
                </div>
              </div>
            </ul>
          </div>
        </div >
      </div>
    </>
  );
};

export default Navbar;
