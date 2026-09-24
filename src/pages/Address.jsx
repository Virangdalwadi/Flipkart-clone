import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar2 from "../components/Navbar2";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance.jsx"; // use your existing axios instance path

const initialAddress = {
  name: "",
  mobile: "",
  pincode: "",
  locality: "",
  address: "",
  city: "",
  state: "",
  landmark: "",
  alternatePhone: "",
  addressType: "home",
  isDefault: false,
};

const Address = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();

  const [addresses, setAddresses] = useState([]);
  const [address, setAddress] = useState(initialAddress);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch saved addresses
  useEffect(() => {
    if (authLoading || !user) return;

    const fetchAddresses = async () => {
      try {
        setLoading(true);

        const response = await axiosInstance.get("/addresses");

        const savedAddresses = response.data?.addresses || response.data || [];

        setAddresses(savedAddresses);

        // IMPORTANT:
        // Show form ONLY if there are no saved addresses.
        if (savedAddresses.length === 0) {
          setShowForm(true);
        } else {
          setShowForm(false);
        }
      } catch (error) {
        console.error("Failed to fetch addresses:", error);

        // Do NOT assume there are no addresses when API fails.
        setShowForm(false);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [user, authLoading]);

  const updateField = (event) => {
    const { name, value } = event.target;

    setAddress((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!address.name.trim()) {
      nextErrors.name = "Name is required.";
    }

    if (!address.mobile.trim()) {
      nextErrors.mobile = "Mobile number is required.";
    } else if (!/^[6-9]\d{9}$/.test(address.mobile.trim())) {
      nextErrors.mobile =
        "Enter a valid 10-digit Indian mobile number.";
    }

    if (!address.pincode.trim()) {
      nextErrors.pincode = "Pincode is required.";
    } else if (!/^\d{6}$/.test(address.pincode.trim())) {
      nextErrors.pincode = "Pincode must contain exactly 6 digits.";
    }

    if (!address.locality.trim()) {
      nextErrors.locality = "Locality is required.";
    }

    if (!address.address.trim()) {
      nextErrors.address = "Address is required.";
    }

    if (!address.city.trim()) {
      nextErrors.city = "City is required.";
    }

    if (!address.state.trim()) {
      nextErrors.state = "State is required.";
    }

    if (
      address.alternatePhone.trim() &&
      !/^[6-9]\d{9}$/.test(address.alternatePhone.trim())
    ) {
      nextErrors.alternatePhone =
        "Enter a valid 10-digit mobile number.";
    }

    return nextErrors;
  };

  // Select existing address
  const handleSelectAddress = (selectedAddress) => {
    navigate("/pages/payment", {
      state: {
        ...location.state,
        address: selectedAddress,
      },
    });
  };

  // Save new address
  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: address.name.trim(),
        mobile: address.mobile.trim(),
        pincode: address.pincode.trim(),
        locality: address.locality.trim(),
        address: address.address.trim(),
        city: address.city.trim(),
        state: address.state.trim(),
        landmark: address.landmark.trim(),
        alternatePhone: address.alternatePhone.trim(),
        addressType: address.addressType,
        isDefault: address.isDefault,
      };

      const response = await axiosInstance.post(
        "/addresses",
        payload
      );

      const savedAddress =
        response.data?.address || response.data;

      // Add newly saved address to current state
      setAddresses((current) => [...current, savedAddress]);

      // Hide form after successful save
      setShowForm(false);

      // Reset form
      setAddress(initialAddress);
      setErrors({});

      // Immediately use newly created address for checkout
      navigate("/pages/payment", {
        state: {
          ...location.state,
          address: savedAddress,
        },
      });
    } catch (error) {
      console.error("Failed to save address:", error);

      const message =
        error.response?.data?.message ||
        "Unable to save address. Please try again.";

      setErrors({
        submit: message,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddNewAddress = () => {
    setAddress(initialAddress);
    setErrors({});
    setShowForm(true);
  };

  const handleCancel = () => {
    setAddress(initialAddress);
    setErrors({});
    setShowForm(false);
  };

  const inputClass = (field) =>
    `w-full border px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500 ${errors[field] ? "border-red-500" : "border-gray-300"
    }`;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f1f2f4]">
        <Navbar2 />

        <main className="grow mx-auto w-full max-w-3xl px-4 pb-8 pt-28">
          <div className="bg-white border border-gray-200 p-6">
            Loading addresses...
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f2f4]">
      <Navbar2 />

      <main className="grow mx-auto w-full max-w-3xl px-4 pb-8 pt-28 md:pt-24">
        <div className="bg-white border border-gray-200 shadow-sm">

          {/* HEADER */}
          <div className="border-b px-5 py-5 sm:px-7">
            <h1 className="text-2xl font-bold text-gray-900">
              Delivery Address
            </h1>
          </div>

          {/* SAVED ADDRESSES */}
          {addresses.length > 0 && !showForm && (
            <div className="p-5 sm:p-7">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Select Delivery Address
                </h2>

                <button
                  type="button"
                  onClick={handleAddNewAddress}
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  + ADD A NEW ADDRESS
                </button>
              </div>

              <div className="space-y-4">
                {addresses.map((item) => (
                  <div
                    key={item._id}
                    className="border border-gray-300 p-5 transition hover:border-blue-500"
                  >
                    {/* TYPE */}
                    <div className="mb-3 flex items-center justify-between">
                      <span className="bg-gray-100 px-2 py-1 text-xs font-semibold uppercase text-gray-700">
                        {item.addressType || "home"}
                      </span>

                      {item.isDefault && (
                        <span className="text-xs font-medium text-green-600">
                          DEFAULT
                        </span>
                      )}
                    </div>

                    {/* NAME + MOBILE */}
                    <div className="mb-2 flex flex-wrap gap-x-5 gap-y-1">
                      <span className="font-semibold text-gray-900">
                        {item.name}
                      </span>

                      <span className="font-medium text-gray-700">
                        {item.mobile}
                      </span>
                    </div>

                    {/* ADDRESS */}
                    <p className="text-sm leading-6 text-gray-700">
                      {item.locality && `${item.locality}, `}
                      {item.address},{" "}
                      {item.city}, {item.state} -{" "}
                      <span className="font-semibold">
                        {item.pincode}
                      </span>
                    </p>

                    {/* SELECT */}
                    <button
                      type="button"
                      onClick={() => handleSelectAddress(item)}
                      className="mt-5 bg-[#2874f0] px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Deliver Here
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ADD ADDRESS FORM */}
          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="p-5 sm:p-7"
            >
              <div className="mb-6 flex items-center justify-between border-b pb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {addresses.length === 0
                    ? "Add Delivery Address"
                    : "Add New Address"}
                </h2>

                {addresses.length > 0 && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="text-sm font-medium text-blue-600"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {errors.submit && (
                <div className="mb-4 border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {errors.submit}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* NAME */}
                <label className="text-sm font-medium text-gray-700">
                  Name

                  <input
                    name="name"
                    type="text"
                    value={address.name}
                    onChange={updateField}
                    className={`${inputClass("name")} mt-1`}
                  />

                  {errors.name && (
                    <span className="mt-1 block text-xs text-red-600">
                      {errors.name}
                    </span>
                  )}
                </label>

                {/* MOBILE */}
                <label className="text-sm font-medium text-gray-700">
                  Mobile Number

                  <input
                    name="mobile"
                    type="tel"
                    maxLength={10}
                    value={address.mobile}
                    onChange={updateField}
                    inputMode="numeric"
                    className={`${inputClass("mobile")} mt-1`}
                  />

                  {errors.mobile && (
                    <span className="mt-1 block text-xs text-red-600">
                      {errors.mobile}
                    </span>
                  )}
                </label>

                {/* PINCODE */}
                <label className="text-sm font-medium text-gray-700">
                  Pincode

                  <input
                    name="pincode"
                    type="text"
                    maxLength={6}
                    value={address.pincode}
                    onChange={updateField}
                    inputMode="numeric"
                    className={`${inputClass("pincode")} mt-1`}
                  />

                  {errors.pincode && (
                    <span className="mt-1 block text-xs text-red-600">
                      {errors.pincode}
                    </span>
                  )}
                </label>

                {/* LOCALITY */}
                <label className="text-sm font-medium text-gray-700">
                  Locality

                  <input
                    name="locality"
                    type="text"
                    value={address.locality}
                    onChange={updateField}
                    className={`${inputClass("locality")} mt-1`}
                  />

                  {errors.locality && (
                    <span className="mt-1 block text-xs text-red-600">
                      {errors.locality}
                    </span>
                  )}
                </label>

                {/* ADDRESS */}
                <label className="text-sm font-medium text-gray-700 sm:col-span-2">
                  Address (Area and Street)

                  <textarea
                    name="address"
                    value={address.address}
                    onChange={updateField}
                    rows={3}
                    className={`${inputClass("address")} mt-1 resize-none`}
                  />

                  {errors.address && (
                    <span className="mt-1 block text-xs text-red-600">
                      {errors.address}
                    </span>
                  )}
                </label>

                {/* CITY */}
                <label className="text-sm font-medium text-gray-700">
                  City / District / Town

                  <input
                    name="city"
                    type="text"
                    value={address.city}
                    onChange={updateField}
                    className={`${inputClass("city")} mt-1`}
                  />

                  {errors.city && (
                    <span className="mt-1 block text-xs text-red-600">
                      {errors.city}
                    </span>
                  )}
                </label>

                {/* STATE */}
                <label className="text-sm font-medium text-gray-700">
                  State

                  <input
                    name="state"
                    type="text"
                    value={address.state}
                    onChange={updateField}
                    className={`${inputClass("state")} mt-1`}
                  />

                  {errors.state && (
                    <span className="mt-1 block text-xs text-red-600">
                      {errors.state}
                    </span>
                  )}
                </label>

                {/* LANDMARK */}
                <label className="text-sm font-medium text-gray-700">
                  Landmark (Optional)

                  <input
                    name="landmark"
                    type="text"
                    value={address.landmark}
                    onChange={updateField}
                    className={`${inputClass("landmark")} mt-1`}
                  />
                </label>

                {/* ALTERNATE PHONE */}
                <label className="text-sm font-medium text-gray-700">
                  Alternate Phone (Optional)

                  <input
                    name="alternatePhone"
                    type="tel"
                    maxLength={10}
                    value={address.alternatePhone}
                    onChange={updateField}
                    inputMode="numeric"
                    className={`${inputClass("alternatePhone")} mt-1`}
                  />

                  {errors.alternatePhone && (
                    <span className="mt-1 block text-xs text-red-600">
                      {errors.alternatePhone}
                    </span>
                  )}
                </label>

                {/* ADDRESS TYPE */}
                <div className="sm:col-span-2">
                  <p className="mb-2 text-sm font-medium text-gray-700">
                    Address Type
                  </p>

                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="addressType"
                        value="home"
                        checked={address.addressType === "home"}
                        onChange={updateField}
                      />
                      Home
                    </label>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="addressType"
                        value="work"
                        checked={address.addressType === "work"}
                        onChange={updateField}
                      />
                      Work
                    </label>
                  </div>
                </div>

                {/* DEFAULT */}
                <label className="flex items-center gap-2 text-sm text-gray-700 sm:col-span-2">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={address.isDefault}
                    onChange={(event) =>
                      setAddress((current) => ({
                        ...current,
                        isDefault: event.target.checked,
                      }))
                    }
                  />

                  Make this my default address
                </label>
              </div>

              {/* BUTTONS */}
              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={
                    addresses.length > 0
                      ? handleCancel
                      : () =>
                        navigate("/pages/checkout", {
                          state: location.state,
                        })
                  }
                  className="border border-blue-600 px-5 py-3 font-medium text-blue-600 hover:bg-blue-50"
                >
                  {addresses.length > 0
                    ? "Cancel"
                    : "Back to Checkout"}
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#ffc200] px-5 py-3 font-medium text-black hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save & Continue"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Address;
