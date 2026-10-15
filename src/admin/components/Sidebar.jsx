import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBagShopping,
  faChartLine,
  faBoxOpen,
  faUsers,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

export default function Sidebar({ isOpen, setIsOpen }) {
  const menuItems = [
    { name: "Dashboard", icon: faChartLine, path: "/admin" },
    { name: "Products", icon: faBoxOpen, path: "/admin/products" },
    { name: "Users", icon: faUsers, path: "/admin/users" },
  ];

  return (
    <aside
      className={`sticky top-0 flex h-screen shrink-0 flex-col bg-[#2874f0] text-white shadow-xl transition-all duration-300 ${isOpen ? "w-64" : "w-16 sm:w-20"
        }`}
    >


      {/* Logo + toggle */}
      <div
        className={`flex items-center  p-3 sm:p-4 ${isOpen ? "justify-between" : "flex-col gap-3"
          }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-300 text-[#0066cc] shadow-md">
            <FontAwesomeIcon icon={faBagShopping} className="text-lg" />
          </div>
          {isOpen && (
            <span className="text-xl font-bold tracking-wide text-white">
              Flipkart</span>

          )}
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-9 w-8 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/15 hover:text-white"
          aria-label={isOpen ? "Collapse navigation" : "Expand navigation"}
        >
          <FontAwesomeIcon icon={faBars} size="xl" />
        </button>
      </div>

      {/* Navigation */}
      <nav aria-label="Admin navigation" className="flex-1 space-y-1 py-4">
        {isOpen && (
          <p className="px-5 pb-2 text-[11px] font-semibold uppercase tracking-widest text-white/50">
            Menu
          </p>
        )}
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin"}
            title={!isOpen ? item.name : undefined}
            className={({ isActive }) =>
              `group relative flex items-center gap-4 py-3 transition-colors ${isOpen ? "mx-3 rounded-lg px-4" : "justify-center px-0"
              } ${isActive
                ? "bg-white/15  text-yellow-300"
                : "text-white hover:bg-white/10 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Lime accent bar like the screenshot */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r bg-yellow-400" />
                )}
                <FontAwesomeIcon
                  icon={item.icon}
                  className="w-5 shrink-0 text-lg"
                  aria-hidden="true"
                />
                <span className={isOpen ? "text-base font-medium" : "sr-only"}>
                  {item.name}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside >
  );
}
