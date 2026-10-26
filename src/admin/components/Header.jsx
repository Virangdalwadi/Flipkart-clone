import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faBell,
  faChevronDown,
  faUser,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const roleLabel = user?.role === "seller" ? "Seller" : "Administrator";
  const username = user?.username || roleLabel;
  const initial = username.charAt(0).toUpperCase();

  // Close dropdown on outside click or Escape
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const handleKey = (e) => e.key === "Escape" && setMenuOpen(false);

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/pages/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-10 flex h-17 items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400"
        />
        <input
          type="search"
          placeholder={user?.role === "seller" ? "Search your products..." : "Search orders, products, users..."}
          className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 outline-none transition focus:border-[#1a8cf0] focus:bg-white focus:ring-2 focus:ring-[#1a8cf0]/20"
        />
      </div>

      {/* Right side */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-[#0066cc]"
        >
          <FontAwesomeIcon icon={faBell} className="text-lg" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <div className="hidden h-8 w-px bg-gray-200 sm:block" />

        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex items-center gap-3 rounded-full py-1 pl-1 pr-2 transition hover:bg-gray-100 sm:pr-3"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-[#1a8cf0] to-[#0066cc] text-sm font-bold text-white shadow">
              {initial}
            </span>
            <span className="hidden text-left leading-tight sm:block">
              <span className="block max-w-30 truncate text-sm font-semibold text-gray-800">
                {username}
              </span>
              <span className="block text-xs text-gray-500">{roleLabel}</span>
            </span>
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`hidden text-xs text-gray-400 transition-transform sm:block ${menuOpen ? "rotate-180" : ""
                }`}
            />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg"
            >
              <div className="border-b border-gray-100 px-4 py-3">
                <p className="truncate text-sm font-semibold text-gray-800">
                  {username}
                </p>
                <p className="text-xs text-gray-500">{roleLabel}</p>
              </div>
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50"
              >
                <FontAwesomeIcon icon={faUser} className="w-4 text-gray-400" />
                Profile
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
              >
                <FontAwesomeIcon icon={faRightFromBracket} className="w-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
