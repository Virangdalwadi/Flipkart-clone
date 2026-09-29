import { useEffect, useState, useRef } from "react";
import Popup from "../Popup.jsx";
import {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} from "../../api/addressApi.js";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi",
];

const LocationPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.6" />
    <circle cx="12" cy="12" r="2.5" fill="white" />
    <path d="M12 1v3M12 20v3M1 12h3M20 12h3" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const initialAddressForm = {
  name: "",
  mobile: "",
  pincode: "",
  locality: "",
  address: "",
  city: "",
  state: "",
  landmark: "",
  alternatePhone: "",
  addressType: "Home",
  isDefault: false,
};

const inputCls =
  "w-full min-w-0 border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 bg-white";

export default function Address({ onCancel }) {
  const [form, setForm] = useState(initialAddressForm);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Controls whether the form is visible
  const [showForm, setShowForm] = useState(false);

  // Address currently being edited
  const [editingAddress, setEditingAddress] = useState(null);

  // Three-dot menu
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);

  const [popup, setPopup] = useState({
    show: false,
    type: "warning",
    title: "",
    message: "",
    onConfirm: null,
    showOkButton: true,
    confirmButtonText: "OK",
  });

  const closePopup = () => setPopup((prev) => ({ ...prev, show: false }));

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // ---------- GET ADDRESSES ----------
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);

        const response = await getAddresses();
        const fetchedAddresses = Array.isArray(response.data?.addresses)
          ? response.data.addresses
          : [];

        setAddresses(fetchedAddresses);

        // If no address exists, automatically show form
        setShowForm(fetchedAddresses.length === 0);
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
        setAddresses([]);
        setShowForm(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  // Close three-dot menu on outside click
  useEffect(() => {
    if (!openMenu) return undefined;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenu]);

  // ---------- FORM HELPERS ----------
  const resetForm = () => {
    setForm(initialAddressForm);
    setEditingAddress(null);
  };

  const handleAddNewAddress = () => {
    resetForm();
    setShowForm(true);
    setOpenMenu(null);
  };

  const handleCancelForm = () => {
    resetForm();
    // If addresses exist hide the form, otherwise keep it (no empty state without form)
    setShowForm(addresses.length === 0);
  };

  // ---------- SAVE ----------
  const handleSave = async () => {
    try {
      const response = await createAddress(form);
      const newAddress = response.data?.address;

      if (newAddress) {
        setAddresses((prev) => [...prev, newAddress]);
      }

      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error("Failed to save address:", error);
      alert(error.response?.data?.message || "Failed to save address");
    }
  };

  // ---------- EDIT / UPDATE ----------
  const handleEditAddress = (item) => {
    setEditingAddress(item);

    setForm({
      name: item.name || "",
      mobile: item.mobile || "",
      pincode: item.pincode || "",
      locality: item.locality || "",
      address: item.address || "",
      city: item.city || "",
      state: item.state || "",
      landmark: item.landmark || "",
      alternatePhone: item.alternatePhone || "",
      addressType: item.addressType || "Home",
      isDefault: item.isDefault || false,
    });

    setShowForm(true);
    setOpenMenu(null);
  };

  const handleUpdate = async () => {
    try {
      const response = await updateAddress(editingAddress._id, form);
      const updatedAddress = response.data?.address;

      if (updatedAddress) {
        setAddresses((prev) =>
          prev.map((item) =>
            item._id === editingAddress._id ? updatedAddress : item
          )
        );
      }

      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error("Failed to update address:", error);
      alert(error.response?.data?.message || "Failed to update address");
    }
  };

  // ---------- DELETE ----------
  const handleDeleteAddress = (id) => {
    setPopup({
      show: true,
      type: "warning",
      title: "Delete Address",
      message: "Are you sure you want to delete this address?",
      confirmButtonText: "Delete",
      showOkButton: true,
      onConfirm: () => confirmDeleteAddress(id),
    });
  };

  const confirmDeleteAddress = async (id) => {
    closePopup();

    try {
      await deleteAddress(id);

      setAddresses((prev) => prev.filter((item) => item._id !== id));
      setOpenMenu(null);

      setAddresses((prev) => {
        if (prev.length === 0) {
          setShowForm(true);
        }
        return prev;
      });
    } catch (error) {
      console.error("Failed to delete address:", error);

      setPopup({
        show: true,
        type: "error",
        title: "Delete Failed",
        message: error.response?.data?.message || "Failed to delete address",
        confirmButtonText: "OK",
        showOkButton: true,
        onConfirm: null,
      });
    }
  };

  return (
    <div className="p-4 sm:p-5">
      <h2 className="text-base font-semibold text-gray-800 mb-5">
        Manage Addresses
      </h2>

      {loading ? (
        <p className="text-sm text-gray-500">Loading addresses...</p>
      ) : (
        <>
          {/* ADD NEW ADDRESS BUTTON (only when addresses exist) */}
          {addresses.length > 0 && !showForm && (
            <div className="flex items-center">
              <button
                type="button"
                onClick={handleAddNewAddress}
                className="flex items-center w-full border border-gray-300 cursor-pointer bg-white px-4 py-2 text-left text-sm font-semibold text-blue-600"
              >
                <span className="mr-4 text-xl font-normal leading-none">+</span>
                <span>ADD A NEW ADDRESS</span>
              </button>
            </div>
          )}

          {/* ADDRESS FORM */}
          {showForm && (
            <div className="bg-gray-50 border border-gray-200 rounded p-4 sm:p-6">
              <p className="text-sm font-semibold text-blue-600 mb-5">
                {editingAddress ? "EDIT ADDRESS" : "ADD A NEW ADDRESS"}
              </p>

              {!editingAddress && (
                <button
                  type="button"
                  className="flex items-center gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded mb-5"
                >
                  <LocationPinIcon />
                  Use my current location
                </button>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Name"
                  className={inputCls}
                />

                <input
                  value={form.mobile}
                  onChange={update("mobile")}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className={inputCls}
                />

                <input
                  value={form.pincode}
                  onChange={update("pincode")}
                  placeholder="Pincode"
                  maxLength={6}
                  className={inputCls}
                />

                <input
                  value={form.locality}
                  onChange={update("locality")}
                  placeholder="Locality"
                  className={inputCls}
                />

                <textarea
                  value={form.address}
                  onChange={update("address")}
                  placeholder="Address (Area and Street)"
                  rows={3}
                  className={`sm:col-span-2 resize-none ${inputCls}`}
                />

                <input
                  value={form.city}
                  onChange={update("city")}
                  placeholder="City/District/Town"
                  className={inputCls}
                />

                <select
                  value={form.state}
                  onChange={update("state")}
                  className={`${inputCls} ${form.state === "" ? "text-gray-400" : "text-gray-800"}`}
                >
                  <option value="">--Select State--</option>
                  {indianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>

                <input
                  value={form.landmark}
                  onChange={update("landmark")}
                  placeholder="Landmark (Optional)"
                  className={inputCls}
                />

                <input
                  value={form.alternatePhone}
                  onChange={update("alternatePhone")}
                  placeholder="Alternate Phone (Optional)"
                  className={inputCls}
                />
              </div>

              {/* ADDRESS TYPE */}
              <div className="mt-5">
                <p className="text-sm text-gray-500 mb-2">Address Type</p>

                <div className="flex gap-8">
                  {["Home", "Work"].map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="addressType"
                        value={type}
                        checked={form.addressType === type}
                        onChange={update("addressType")}
                        className="accent-blue-600"
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex items-center gap-6 mt-6">
                <button
                  type="button"
                  onClick={editingAddress ? handleUpdate : handleSave}
                  className="bg-blue-600 cursor-pointer text-white text-sm font-semibold px-10 py-2.5 rounded"
                >
                  {editingAddress ? "UPDATE" : "SAVE"}
                </button>

                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="text-sm cursor-pointer text-blue-600 font-medium"
                >
                  CANCEL
                </button>
              </div>
            </div>
          )}

          {/* SAVED ADDRESS CARDS */}
          {!showForm && addresses.length === 0 && (
            <p className="text-sm text-gray-500 mt-5">No saved addresses found.</p>
          )}

          {addresses.length > 0 && (
            <div className="space-y-3 mt-6">
              {addresses.map((item) => (
                <div
                  key={item._id}
                  className="relative border border-gray-200 rounded p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <span className="inline-block text-xs uppercase mb-3 bg-gray-100 px-2 py-1 rounded">
                        {item.addressType || "HOME"}
                      </span>

                      <div className="flex items-center gap-5">
                        <p className="font-semibold text-sm text-gray-800">
                          {item.name || ""}
                        </p>
                        <p className="font-semibold text-sm text-gray-800">
                          {item.mobile || ""}
                        </p>
                      </div>

                      <p className="text-sm text-gray-700 mt-4">
                        {item.address || ""}
                        {item.address && item.locality ? ", " : ""}
                        {item.locality || ""}
                        {item.locality && item.city ? ", " : ""}
                        {item.city || ""}
                        {item.city && item.state ? ", " : ""}
                        {item.state || ""}
                        {item.state && item.pincode ? " - " : ""}
                        <strong>{item.pincode || ""}</strong>
                      </p>
                    </div>

                    {/* THREE DOT MENU */}
                    <div
                      className="relative ml-4"
                      ref={openMenu === item._id ? menuRef : null}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenu(openMenu === item._id ? null : item._id)
                        }
                        className="text-gray-500 cursor-pointer hover:text-gray-700 text-2xl leading-none px-1"
                      >
                        ⋮
                      </button>

                      {openMenu === item._id && (
                        <div className="absolute right-0 top-0 z-20 w-28 rounded bg-white shadow-lg border border-gray-200">
                          <button
                            type="button"
                            onClick={() => handleEditAddress(item)}
                            className="block w-full px-4 py-2.5 text-left cursor-pointer text-sm text-gray-800 hover:bg-gray-50 hover:text-blue-600"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(item._id)}
                            className="block w-full px-4 py-2.5 text-left text-sm cursor-pointer text-gray-800 hover:bg-gray-50 hover:text-blue-600"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <Popup
        show={popup.show}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        onConfirm={popup.onConfirm}
        onClose={closePopup}
        showOkButton={popup.showOkButton}
        confirmButtonText={popup.confirmButtonText}
      />
    </div>
  );
}
