import React, { useState } from "react";

// Pages
// Font Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import { useAuth } from "../context/AuthContext";

const Navbar = ({ setValue }) => {

  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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
          <div>
            <div className="flex flex-row gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 flex-row gap-2 sm:gap-3">
                <div className="flex py-3 min-w-0 flex-1 cursor-pointer items-center justify-center rounded-xl bg-[#ffe51f] px-3 sm:w-40 sm:flex-none sm:px-6">
                  <img className="size-7 mr-1" src={logo} />
                  <img className="h-5 w-15" src={name} />
                </div>
                <div className="flex min-w-0 flex-1 cursor-pointer items-center justify-center rounded-xl bg-slate-200 px-3 sm:w-40 sm:flex-none sm:px-6">
                  <img className="size-7 mr-1" src={Aeroplane} />
                  <img className="h-5 w-10" src={travel} />
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
          </div>

          <div className="flex flex-col gap-2 pb-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full min-w-0 sm:flex-1">
              <SearchBar
                value={search}
                onChange={setSearch}
                onSubmitSuccess={handleFormSubmit}
                onClear={handleBack}
              />

            </div>

            <div className="flex w-full items-center justify-start sm:w-auto sm:justify-end">

              <div className="flex w-full sm:w-auto">

                <NavLink to="/">
                  <button className="ml-1 cursor-pointer rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4" onClick={handleHomenavigation}>Home</button>
                </NavLink>
                {user ? (
                  <>
                    <NavLink to="/pages/profile">
                      <button className="ml-1 cursor-pointer rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4">Profile</button>
                    </NavLink>
                    <button onClick={async () => { await logout(); navigate("/"); }} className="ml-1 cursor-pointer rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4">Logout</button>
                  </>
                ) : (
                  <>
                    <NavLink to="/pages/login" state={{ mode: "login" }}>
                      <button className="ml-1 cursor-pointer rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4">Login</button>
                    </NavLink>
                    <NavLink to="/pages/login" state={{ mode: "register" }}>
                      <button className="ml-1 cursor-pointer rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4">Register</button>
                    </NavLink>
                  </>
                )}

                <NavLink to="/pages/Cart">
                  <button className="ml-1 cursor-pointer rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4">Cart</button>
                </NavLink>
              </div>
            </div>
          </div>
          <div>
            <ul>
              <div className="scrollbar-hide cursor-pointer flex gap-1 overflow-x-auto px-1 pb-2 sm:px-5">
                <div onClick={handleForyou} className="px-2.5 flex flex-col items-center underline:none hover:underline">
                  <img src={nav1} />
                  <li className="">For_You</li>
                </div>
                <div onClick={handleFashion} className="px-2.5 flex cursor-pointer flex-col items-center underline:none hover:underline">
                  <img src={nav2} />
                  <li className="underline:none hover:underline">Fashion</li>
                </div>
                <div onClick={handleMobile} className="px-2.5 cursor-pointer flex flex-col items-center underline:none hover:underline">
                  <img src={nav3} />
                  <li className="underline:none hover:underline">Mobiles</li>
                </div>
                <div onClick={handleElectronics} className="px-2.5 cursor-pointer flex flex-col items-center underline:none hover:underline">
                  <img src={nav4} />
                  <li className="underline:none hover:underline">Electronics</li>
                </div>
                <div onClick={handleBeauty} className="px-2.5 flex cursor-pointer flex-col items-center underline:none hover:underline">
                  <img src={nav6} />
                  <li className="underline:none hover:underline">Beauty</li>
                </div>
                <div onClick={handleHome} className="px-2.5 flex cursor-pointer flex-col items-center underline:none hover:underline">
                  <img className="size-8" src={nav5} />
                  <li className="">Home</li>
                </div>
                <div onClick={handleAppliances} className="px-2.5 cursor-pointer flex flex-col items-center underline:none hover:underline">
                  <img src={nav7} />
                  <li className="underline:none hover:underline">Appliances</li>
                </div>
                <div onClick={handleToys} className="px-2.5 cursor-pointer flex flex-col items-center underline:none hover:underline">
                  <img src={nav8} />
                  <li className="underline:none hover:underline">Toys</li>
                </div>
                <div onClick={handleFood} className="px-2.5 cursor-pointer flex flex-col items-center underline:none hover:underline">
                  <img src={nav9} />
                  <li className="underline:none hover:underline">Food</li>
                </div>
                <div onClick={handlAuto} className="px-2.5 cursor-pointer flex flex-col items-center underline:none hover:underline">
                  <img src={nav10} />
                  <li className="underline:none hover:underline">Auto</li>
                </div>
                <div onClick={handleSports} className="px-2.5 cursor-pointer flex flex-col items-center underline:none hover:underline">
                  <img src={nav11} />
                  <li className="underline:none hover:underline">Sports</li>
                </div>
                <div onClick={handleFurniture} className="px-2.5 cursor-pointer flex flex-col items-center underline:none hover:underline">
                  <img src={nav12} />
                  <li className="underline:none hover:underline">Furniture</li>
                </div>
                <div onClick={handleBooks} className="px-2.5 cursor-pointer flex flex-col items-center underline:none hover:underline">
                  <img src={nav13} />
                  <li className="underline:none hover:underline">Books</li>
                </div>
                <div onClick={handleTwowheels} className="px-2.5 cursor-pointer flex flex-col items-center underline:none hover:underline">
                  <img src={nav14} />
                  <li className="underline:none inline-block hover:underline">2_Wheels</li>
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
