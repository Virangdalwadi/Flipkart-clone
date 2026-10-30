import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/images/Logo/logo.webp";
import name from "../assets/images/Logo/name.webp";
import SearchBar from "./SearchBar";
import { useAuth } from "../context/AuthContext";
import useProductSuggestions from "../hooks/useProductSuggestions";

const Navbar2 = ({ setValue }) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    suggestions,
    loading: suggestionsLoading,
    error: suggestionsError,
  } = useProductSuggestions(search);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSuggestionClick = (item) => {
    setSearch("");
    if (setValue) setValue("");
    if (item?.id) {
      navigate(`/products/${item.id}`);
    } else if (item?.title) {
      navigate(`/?search=${encodeURIComponent(item.title.trim())}`);
    }
  };

  const handleFormSubmit = (value) => {
    const trimmed = (value || "").trim();
    setSearch(trimmed);
    if (setValue) setValue(trimmed);
    if (trimmed) {
      navigate(`/?search=${encodeURIComponent(trimmed)}`);
    } else {
      navigate("/");
    }
  };

  function handleBack() {
    setSearch("");
    if (setValue) setValue("");
    navigate("/");
  }

  const handleHomenavigation = () => {
    setSearch("");
    if (setValue) setValue("");
    navigate("/");
  };

  function handleSports() {
    const value = "sports-accessories";
    handleFormSubmit(value);
  }

  return (

    <>
      <div className="fixed top-0 left-0 right-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
        <div className="relative mx-auto w-full max-w-6xl px-2 sm:px-3 md:px-4 lg:px-6">

          {/* Main Navbar Row */}
          <div className="flex items-center gap-2 py-2 sm:gap-3 sm:py-3">

            {/* Logo */}
            <div className="flex shrink-0 cursor-pointer items-center justify-center rounded-lg bg-[#ffe51f] px-2 py-1.5 sm:px-3">
              <img
                width="24"
                height="24"
                className="mr-1 size-5 sm:size-6"
                src={logo}
                alt="Flipkart logo"
              />
              <img
                width="60"
                height="20"
                className="h-4 w-auto sm:h-5"
                src={name}
                alt="Flipkart wordmark"
              />
            </div>

            {/* Search Bar */}
            <div className="min-w-0 flex-1">
              <SearchBar
                value={search}
                onChange={setSearch}
                onSubmitSuccess={handleFormSubmit}
                onClear={handleBack}
                onSuggestionClick={handleSuggestionClick}
                suggestions={suggestions}
                suggestionsLoading={suggestionsLoading}
                suggestionsError={suggestionsError}
              />
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-800 transition-colors hover:bg-gray-100 lg:hidden"
            >
              {mobileMenuOpen ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-6 w-6"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-6 w-6"
                >
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

            {/* Desktop Navigation - Unchanged */}
            <div className="hidden shrink-0 items-center gap-2 lg:flex">

              <NavLink to="/">
                <button
                  onClick={handleHomenavigation}
                  className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Home
                </button>
              </NavLink>

              {user ? (
                <>
                  <NavLink to="/pages/profile">
                    <button className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">
                      Profile
                    </button>
                  </NavLink>

                  <button
                    onClick={async () => {
                      await logout();
                      navigate("/");
                    }}
                    className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/pages/login", { state: { mode: "login" } })}
                    className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Login
                  </button>

                  <button
                    onClick={() => navigate("/pages/login", { state: { mode: "register" } })}
                    className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Register
                  </button>
                </>
              )}

              <NavLink to="/pages/Cart">
                <button className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">
                  Cart
                </button>
              </NavLink>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="absolute right-2 top-full z-50 mt-1 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl lg:hidden">

              <div className="flex flex-col p-2">

                <NavLink
                  to="/"
                  onClick={() => {
                    handleHomenavigation();
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  Home
                </NavLink>

                {user ? (
                  <>
                    <NavLink
                      to="/pages/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                      Profile
                    </NavLink>

                    <button
                      onClick={async () => {
                        setMobileMenuOpen(false);
                        await logout();
                        navigate("/");
                      }}
                      className="rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate("/pages/login", { state: { mode: "login" } });
                      }}
                      className="rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                      Login
                    </button>

                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate("/pages/login", { state: { mode: "register" } });
                      }}
                      className="rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                      Register
                    </button>
                  </>
                )}

                <NavLink
                  to="/pages/Cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  Cart
                </NavLink>

              </div>
            </div>
          )}

        </div>
      </div>
    </>

  );
};

export default Navbar2;
