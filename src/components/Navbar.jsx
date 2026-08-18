import React, { useState } from "react";

// Pages
import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";

//Font Icons
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
// import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

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
    setValue(value);
  }

  const handlelogin = () => {
    alert("Login Appears")
  }

  function handleBack() {
    if (!setValue) return
    setValue("");
    navigate("/");
    console.log("Navigated Successfully")
  }

  return (
    <>
      <div className="max-w-6xl m-auto p-auto">
        <div>
          <div className=" flex justify-between items-center p-3 ">
            <div className="flex flex-row gap-3">
              <div className="flex justify-center rounded-xl items-center p-6 h-8 w-40 bg-amber-300">
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
                {/* <span>
                <FontAwesomeIcon icon={faLocationDot} />
              </span> */}
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
            <SearchBar onSubmitSuccess={handleFormSubmit} />



          </div>

          <div className=" flex flex-row flex-wrap w-100 justify-between items-center" >

            <button className="bg-red-500 px-2.5  ml-2 text-white rounded-sm" onClick={handleBack}>X</button>


            <div className="flex">

              <NavLink to="/">
                <button className="text-white ml-1 bg-blue-600 hover:bg-blue-700 focus:ring-4 font-medium rounded-xl text-sm px-3 py-1.5 transition-colors focus:outline-none">Home</button>
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
        <div>
          <ul>
            <div className="flex gap-1 px-5">
              <div className="px-2.5 flex flex-col items-center underline:none hover:underline">
                <img src={nav1} />
                <li className="underline:none hover:underline">For You</li>
              </div>
              <div className="px-2.5 flex flex-col items-center underline:none hover:underline">
                <img src={nav2} />
                <li className="underline:none hover:underline">Fashion</li>
              </div>
              <div className="px-2.5 flex flex-col items-center underline:none hover:underline">
                <img src={nav3} />
                <li className="underline:none hover:underline">Mobiles</li>
              </div>
              <div className="px-2.5 flex flex-col items-center underline:none hover:underline">
                <img src={nav4} />
                <li className="underline:none hover:underline">Electronics</li>
              </div>
              <div className="px-2.5 flex flex-col items-center underline:none hover:underline">
                <img src={nav6} />
                <li className="underline:none hover:underline">Beauty</li>
              </div>
              <div className="px-2.5 flex flex-col items-center underline:none hover:underline">
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
              <div className="px-2.5 flex flex-col items-center underline:none hover:underline">
                <img src={nav11} />
                <li className="underline:none hover:underline">Sports</li>
              </div>
              <div className="px-2.5 flex flex-col items-center underline:none hover:underline">
                <img src={nav12} />
                <li className="underline:none hover:underline">Furniture</li>
              </div>
              <div className="px-2.5 flex flex-col items-center underline:none hover:underline">
                <img src={nav13} />
                <li className="underline:none hover:underline">Books</li>
              </div>
              <div className="px-2.5 flex flex-col items-center underline:none hover:underline">
                <img src={nav14} />
                <li className="underline:none hover:underline">2 Wheels</li>
              </div>
            </div>
          </ul>
        </div>
      </div >
    </>
  );
};

export default Navbar;
