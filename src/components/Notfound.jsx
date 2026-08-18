import React from "react";
import { NavLink } from "react-router-dom";

const Notfound = () => {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        {/* Error Code Badge */}
        <p className="text-base font-semibold text-blue-600 animate-bounce">
          404
        </p>

        {/* Main Heading */}
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Page Not Found
        </h1>

        {/* Explanatory Text */}
        <p className="mt-6 text-base leading-7 text-slate-600 max-w-md mx-auto">
          Sorry, we couldn’t find the page you’re looking for. It might have been moved or deleted.
        </p>

        {/* Interactive Action Buttons */}
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <NavLink
            to="/"
            className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-200"
          >
            Go back home
          </NavLink>
        </div>
      </div>
    </main>
  );
};

export default Notfound;
