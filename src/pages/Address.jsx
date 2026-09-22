import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar3 from "../components/Navbar3";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const initialAddress = {
  fullName: "",
  mobile: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

const Address = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [address, setAddress] = useState(initialAddress);
  const [errors, setErrors] = useState({});
  const { user, loading } = useAuth();

  const updateField = (event) => {
    const { name, value } = event.target;
    setAddress((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  const validate = () => {
    const nextErrors = {};
    if (!address.fullName.trim()) nextErrors.fullName = "Full name is required.";
    if (!address.mobile.trim()) {
      nextErrors.mobile = "Mobile number is required.";
    } else if (!/^[6-9]\d{9}$/.test(address.mobile.trim())) {
      nextErrors.mobile = "Enter a valid 10-digit Indian mobile number.";
    }
    if (!address.address.trim()) nextErrors.address = "Address is required.";
    if (!address.city.trim()) nextErrors.city = "City is required.";
    if (!address.state.trim()) nextErrors.state = "State is required.";
    if (!address.pincode.trim()) {
      nextErrors.pincode = "Pincode is required.";
    } else if (!/^\d{6}$/.test(address.pincode.trim())) {
      nextErrors.pincode = "Pincode must contain exactly 6 digits.";
    }
    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    navigate("/pages/payment", {
      state: { address: { ...address, mobile: address.mobile.trim(), pincode: address.pincode.trim() } },
    });
  };

  const inputClass = (field) =>
    `w-full border px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500 ${errors[field] ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f2f4]">
      <Navbar3 />
      <main className="grow mx-auto w-full max-w-3xl px-4 pb-8 pt-28 md:pt-24">
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-5 shadow-sm sm:p-7">
          <h1 className="border-b pb-4 text-2xl font-bold text-gray-900">Delivery Address</h1>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              ["fullName", "Full Name", "text"],
              ["mobile", "Mobile Number", "tel"],
              ["city", "City", "text"],
              ["state", "State", "text"],
              ["pincode", "Pincode", "text"],
            ].map(([field, label, type]) => (
              <label key={field} className="text-sm font-medium text-gray-700">
                {label}
                <input
                  name={field}
                  type={type}
                  value={address[field]}
                  onChange={updateField}
                  className={`${inputClass(field)} mt-1`}
                  inputMode={field === "mobile" || field === "pincode" ? "numeric" : undefined}
                />
                {errors[field] && <span className="mt-1 block text-xs text-red-600">{errors[field]}</span>}
              </label>
            ))}

            <label className="text-sm font-medium text-gray-700 sm:col-span-2">
              Address Line
              <textarea
                name="address"
                value={address.address}
                onChange={updateField}
                rows={3}
                className={`${inputClass("address")} mt-1 resize-none`}
              />
              {errors.address && <span className="mt-1 block text-xs text-red-600">{errors.address}</span>}
            </label>
          </div>

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={() => navigate("/pages/checkout", { state: location.state })}
              className="border border-blue-600 px-5 py-3 font-medium text-blue-600 hover:bg-blue-50"
            >
              Back to Checkout
            </button>
            <button type="submit" className="bg-[#ffc200] px-5 py-3 font-medium text-black hover:bg-yellow-400">
              Continue to Payment
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default Address;
