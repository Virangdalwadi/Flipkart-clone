import { useEffect, useState } from "react";

// Images
import MyOrdersIcon from "../assets/images/Profile Page Image/My ORDERS.svg";
import ProfileAvatar from "../assets/images/Profile Page Image/ProfileAvatar.svg";
import AccountSettingsIcon from "../assets/images/Profile Page Image/ACCOUNT SETTINGS.svg";
import PaymentsIcon from "../assets/images/Profile Page Image/PAYMENTS.svg";
import MyStuffIcon from "../assets/images/Profile Page Image/MY STUFF.svg";
import LogoutIcon from "../assets/images/Profile Page Image/Logout.svg";

import Footer from "../components/Footer";
import Navbar2 from "../components/Navbar2";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import Orders from "../components/profile/Orders";
import Address from "../components/profile/Address";
import ProfileInformation from "../components/profile/ProfileInformation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

// Kept so any other file importing these from Profile.jsx keeps working.
// Prefer importing from "../api/addressApi.js" going forward.
export {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
} from "../api/Addressapi.js";

/* ---------- Sidebar nav data ---------- */

const ORDERS = "My Orders";
const PROFILE_INFO = "Profile Information";
const ADDRESSES = "Manage Addresses";

const settingsLinks = [PROFILE_INFO, ADDRESSES, "PAN Card Information"];
const paymentsLinks = [
  { label: "Gift Cards", trailing: "₹0" },
  { label: "Saved UPI" },
  { label: "Saved Cards" },
];
const stuffLinks = ["My Coupons", "My Reviews & Ratings", "All Notifications", "My Wishlist"];

/* ---------- Page ---------- */

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Shared: shown in the sidebar/header AND edited in ProfileInformation
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(PROFILE_INFO);

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setFirstName(user?.username || "");
  }, [user]);

  const renderContent = () => {
    switch (activeLink) {
      case ORDERS:
        return <Orders />;
      case ADDRESSES:
        return <Address onCancel={() => setActiveLink(PROFILE_INFO)} />;
      default:
        return (
          <ProfileInformation
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
          />
        );
    }
  };

  return (
    <>
      {/* Desktop Header Navbar */}
      <div className="hidden md:block">
        <Navbar2 />
      </div>

      {/* Mobile Fixed Top Header Bar (< 768px) */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 px-4 h-14 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="p-1.5 -ml-1.5 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-semibold text-gray-800 text-base">My Account</span>
        </div>

        <div className="flex items-center gap-2">
          <img width="400"
            height="400" className="size-8 rounded-full" src={ProfileAvatar} alt="" />
          <span className="text-sm font-semibold text-gray-700 max-w-30 truncate">{firstName || "User"}</span>
        </div>
      </header>

      {/* Mobile Drawer Backdrop Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setIsDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Modal Navigation Drawer */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-[80%] max-w-sm bg-white shadow-2xl flex flex-col justify-between overflow-y-auto transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        role="dialog"
        aria-modal="true"
      >
        <div>
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
              <img width="400"
                height="400" className="size-10 rounded-full" src={ProfileAvatar} alt="" />
              <div>
                <p className="text-xs text-gray-500">Hello,</p>
                <p className="text-sm font-semibold text-gray-800 truncate max-w-40">
                  {firstName} {lastName}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-200 transition-colors cursor-pointer"
              aria-label="Close navigation drawer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="py-2">
            {/* Home Link */}
            <button
              onClick={() => {
                setIsDrawerOpen(false);
                navigate("/");
              }}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <span className="text-base leading-none pr-1">
                <FontAwesomeIcon icon={faHouse} size="lg" style={{ color: "rgb(21, 93, 252)" }} />
              </span>
              HOME
            </button>

            {/* My Orders */}
            <button
              onClick={() => {
                setActiveLink(ORDERS);
                setIsDrawerOpen(false);
              }}
              className={`w-full flex items-center justify-between px-5 py-3 border-b border-gray-100 hover:text-blue-600 hover:bg-gray-50 transition-colors cursor-pointer ${activeLink === ORDERS ? "text-blue-600" : "text-gray-800"
                }`}
            >
              <span className="flex items-center gap-3 text-sm font-semibold">
                <img width="400"
                  height="400" className="size-5" src={MyOrdersIcon} alt="" />
                MY ORDERS
              </span>
            </button>

            {/* Account Settings */}
            <div className="border-b border-gray-100 py-3">
              <div className="flex items-center gap-3 px-5 text-sm font-semibold text-gray-800 mb-1">
                <img width="400"
                  height="400" className="size-5" src={AccountSettingsIcon} alt="" />
                ACCOUNT SETTINGS
              </div>
              <ul>
                {settingsLinks.map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => {
                        setActiveLink(link);
                        setIsDrawerOpen(false);
                      }}
                      className={`w-full text-left pl-12 pr-5 py-2.5 text-sm transition-colors cursor-pointer ${activeLink === link
                        ? "text-blue-600 bg-blue-50 font-semibold"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                        }`}
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Payments */}
            <div className="border-b border-gray-100 py-3">
              <div className="flex items-center gap-3 px-5 text-sm font-semibold text-gray-800 mb-1">
                <img width="400"
                  height="400" className="size-5" src={PaymentsIcon} alt="" />
                PAYMENTS
              </div>
              <ul>
                {paymentsLinks.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => setIsDrawerOpen(false)}
                      className="w-full flex items-center justify-between pl-12 pr-5 py-2.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <span>{link.label}</span>
                      {link.trailing && <span className="text-green-600 font-medium">{link.trailing}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* My Stuff */}
            <div className="border-b border-gray-100 py-3">
              <div className="flex items-center gap-3 px-5 text-sm font-semibold text-gray-800 mb-1">
                <img width="400"
                  height="400" className="size-5" src={MyStuffIcon} alt="" />
                MY STUFF
              </div>
              <ul>
                {stuffLinks.map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => setIsDrawerOpen(false)}
                      className="w-full text-left pl-12 pr-5 py-2.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Logout */}
            <button
              onClick={async () => {
                setIsDrawerOpen(false);
                await logout();
                navigate("/");
              }}
              className="w-full flex items-center gap-3 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <img width="400"
                height="400" className="size-5" src={LogoutIcon} alt="" />
              Logout
            </button>
          </div>
        </div>

        {/* Frequently Visited Footer in Drawer */}
        <div className="bg-gray-50 border-t border-gray-100 px-5 py-3 mt-auto">
          <p className="text-xs font-semibold text-gray-500 mb-1.5">Frequently Visited</p>
          <div className="flex gap-4 text-xs text-gray-500">
            <span className="hover:text-blue-600 cursor-pointer">Track Order</span>
            <span className="hover:text-blue-600 cursor-pointer">Help Center</span>
          </div>
        </div>
      </div>

      <div className="pt-13 md:pt-14">
        <div className="min-h-screen bg-gray-200 py-6 px-4">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-4">
            {/* ---------- Desktop Sidebar ---------- */}
            <aside className="hidden md:block md:w-64 shrink-0 space-y-3">
              <div className="bg-white rounded shadow-sm">
                {/* Hello, user */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
                  <img width="400"
                    height="400" className="size-10 mr-1" src={ProfileAvatar} alt="" />
                  <div>
                    <p className="text-xs text-gray-500">Hello,</p>
                    <p className="wrap-break-word text-sm font-semibold text-gray-800">{firstName} {lastName}</p>
                  </div>
                </div>

                {/* My Orders */}
                <button
                  onClick={() => setActiveLink(ORDERS)}
                  className={`w-full flex items-center justify-between cursor-pointer px-4 py-3 border-b border-gray-100 hover:text-blue-600 hover:bg-gray-50 ${activeLink === ORDERS ? "text-blue-600" : "text-gray-800"
                    }`}
                >
                  <span className="flex items-center gap-3 text-sm font-semibold">
                    <img width="400"
                      height="400" className="size-5" src={MyOrdersIcon} alt="" />
                    MY ORDERS
                  </span>
                </button>

                {/* Account Settings */}
                <div className="border-b border-gray-100 py-3">
                  <div className="flex items-center gap-3 px-4 text-sm font-semibold text-gray-800">
                    <img width="400"
                      height="400" className="size-5" src={AccountSettingsIcon} alt="" />
                    ACCOUNT SETTINGS
                  </div>
                  <ul className="mt-2">
                    {settingsLinks.map((link) => (
                      <li key={link}>
                        <button
                          onClick={() => setActiveLink(link)}
                          className={`w-full text-left cursor-pointer pl-11 pr-4 py-1.5 text-sm ${activeLink === link
                            ? "text-blue-600 bg-blue-50 font-semibold"
                            : " hover:text-blue-600 hover:bg-blue-50"
                            }`}
                        >
                          {link}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Payments */}
                <div className="border-b border-gray-100 py-3">
                  <div className="flex items-center gap-3 px-4 text-sm font-semibold text-gray-800">
                    <img width="400"
                      height="400" className="size-5" src={PaymentsIcon} alt="" />
                    PAYMENTS
                  </div>
                  <ul className="mt-2">
                    {paymentsLinks.map((link) => (
                      <li key={link.label}>
                        <button className="w-full flex cursor-pointer items-center justify-between pl-11 pr-4 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50">
                          <span>{link.label}</span>
                          {link.trailing && <span className="text-green-600">{link.trailing}</span>}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* My Stuff */}
                <div className="py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3 px-4 text-sm font-semibold text-gray-800">
                    <img width="400"
                      height="400" className="size-5" src={MyStuffIcon} alt="" />
                    MY STUFF
                  </div>
                  <ul className="mt-2">
                    {stuffLinks.map((link) => (
                      <li key={link}>
                        <button className="w-full cursor-pointer text-left pl-11 pr-4 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50">
                          {link}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Logout */}
                <button
                  onClick={async () => {
                    await logout();
                    navigate("/");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-base font-semibold text-gray-500 hover:text-red-400 transition-colors duration-200 cursor-pointer"
                >
                  <img width="400"
                    height="400" className="size-7" src={LogoutIcon} alt="" />
                  Logout
                </button>
              </div>

              {/* Frequently visited */}
              <div className="bg-white rounded shadow-sm px-4 py-3">
                <p className="text-xs font-semibold text-gray-500 mb-2">Frequently Visited</p>
                <div className="flex gap-4 text-xs text-gray-600">
                  <span>Track Order</span>
                  <span>Help Center</span>
                </div>
              </div>
            </aside>

            {/* ---------- Main content ---------- */}
            <main className="min-w-0 flex-1 rounded bg-white shadow-sm relative">
              {renderContent()}
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
