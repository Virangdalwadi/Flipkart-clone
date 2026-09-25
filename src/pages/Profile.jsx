
import { useEffect, useState, useRef } from "react";
import MyOrdersIcon from "../assets/Profile Page Image/My ORDERS.svg"
import ProfileAvatar from "../assets/Profile Page Image/ProfileAvatar.svg"
import AccountSettingsIcon from "../assets/Profile Page Image/ACCOUNT SETTINGS.svg"
import PaymentsIcon from "../assets/Profile Page Image/PAYMENTS.svg"
import MyStuffIcon from "../assets/Profile Page Image/MY STUFF.svg"
import LogoutIcon from "../assets/Profile Page Image/Logout.svg"
import FooterArt from "../assets/Profile Page Image/Footer.png"
import Footer from "../components/Footer";
import Navbar2 from "../components/Navbar2";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance.jsx";
import Popup from "../components/Popup.jsx";

export const createAddress = (data) => api.post("/addresses", data);

export const getAddresses = () => api.get("/addresses");

export const getAddressById = (id) => api.get(`/addresses/${id}`);

export const updateAddress = (id, data) => api.put(`/addresses/${id}`, data);

export const deleteAddress = (id) => api.delete(`/addresses/${id}`);




/* ---------- Sidebar nav data ---------- */

const settingsLinks = ["Profile Information", "Manage Addresses", "PAN Card Information"];
const paymentsLinks = [
  { label: "Gift Cards", trailing: "₹0" },
  { label: "Saved UPI" },
  { label: "Saved Cards" },
];
const stuffLinks = ["My Coupons", "My Reviews & Ratings", "All Notifications", "My Wishlist"];

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi",
];

const faqs = [
  {
    q: "What happens when I update my email address (or mobile number)?",
    a: "Your login email id (or mobile number) changes, likewise. You'll receive all your account related communication on your updated email address (or mobile number).",
  },
  {
    q: "When will my Flipkart account be updated with the new email address (or mobile number)?",
    a: "It happens as soon as you confirm the verification code sent to your email (or mobile) and save the changes.",
  },
  {
    q: "What happens to my existing Flipkart account when I update my email address (or mobile number)?",
    a: "Updating your email address (or mobile number) doesn't invalidate your account. Your account remains fully functional. You'll continue seeing your Order history, saved information and personal details.",
  },
  {
    q: "Does my Seller account get affected when I update my email address?",
    a: "Flipkart has a 'single sign-on' policy. Any changes will reflect in your Seller account also.",
  },
];

/* ---------- Small icons ---------- */

const LocationPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.6" />
    <circle cx="12" cy="12" r="2.5" fill="white" />
    <path d="M12 1v3M12 20v3M1 12h3M20 12h3" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

/* ---------- Manage Addresses panel ---------- */

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

function ManageAddresses({ onCancel }) {
  const [form, setForm] = useState(initialAddressForm);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Controls whether the form is visible
  const [showForm, setShowForm] = useState(false);

  // Stores address currently being edited
  const [editingAddress, setEditingAddress] = useState(null);

  // Controls three-dot menu
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);



  const update = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  // --------------------------------------------------
  // GET ADDRESSES
  // --------------------------------------------------

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
        if (fetchedAddresses.length === 0) {
          setShowForm(true);
        } else {
          setShowForm(false);
        }
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
        setAddresses([]);

        // If address could not be fetched,
        // show the address form
        setShowForm(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

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

  const inputCls =
    "w-full min-w-0 border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 bg-white";

  // --------------------------------------------------
  // RESET FORM
  // --------------------------------------------------

  const resetForm = () => {
    setForm(initialAddressForm);
    setEditingAddress(null);
  };

  // --------------------------------------------------
  // ADD NEW ADDRESS
  // --------------------------------------------------

  const handleAddNewAddress = () => {
    resetForm();
    setShowForm(true);
    setOpenMenu(null);
  };

  // --------------------------------------------------
  // SAVE NEW ADDRESS
  // --------------------------------------------------

  const handleSave = async () => {
    try {
      const response = await createAddress(form);

      const newAddress = response.data?.address;

      if (newAddress) {
        setAddresses((prev) => [...prev, newAddress]);
      }

      resetForm();

      // Hide form after successful save
      setShowForm(false);
    } catch (error) {
      console.error("Failed to save address:", error);

      alert(
        error.response?.data?.message ||
        "Failed to save address"
      );
    }
  };

  // --------------------------------------------------
  // EDIT ADDRESS
  // --------------------------------------------------

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

  // --------------------------------------------------
  // UPDATE ADDRESS
  // --------------------------------------------------

  const handleUpdate = async () => {
    try {
      const response = await updateAddress(
        editingAddress._id,
        form
      );

      const updatedAddress = response.data?.address;

      if (updatedAddress) {
        setAddresses((prev) =>
          prev.map((item) =>
            item._id === editingAddress._id
              ? updatedAddress
              : item
          )
        );
      }

      resetForm();

      // Hide form after update
      setShowForm(false);
    } catch (error) {
      console.error("Failed to update address:", error);

      alert(
        error.response?.data?.message ||
        "Failed to update address"
      );
    }
  };

  // --------------------------------------------------
  // DELETE ADDRESS
  // --------------------------------------------------

  // const handleDeleteAddress = async (id) => {
  //   const confirmDelete = window.confirm(
  //     "Are you sure you want to delete this address?"
  //   );

  //   if (!confirmDelete) return;

  //   try {
  //     await deleteAddress(id);

  //     setAddresses((prev) =>
  //       prev.filter((item) => item._id !== id)
  //     );

  //     setOpenMenu(null);

  //     // If this was the last address,
  //     // automatically show the form
  //     setAddresses((prev) => {
  //       if (prev.length === 0) {
  //         setShowForm(true);
  //       }

  //       return prev;
  //     });
  //   } catch (error) {
  //     console.error("Failed to delete address:", error);

  //     alert(
  //       error.response?.data?.message ||
  //       "Failed to delete address"
  //     );
  //   }
  // };

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
        message:
          error.response?.data?.message || "Failed to delete address",
        confirmButtonText: "OK",
        showOkButton: true,
        onConfirm: null,
      });
    }
  };



  // --------------------------------------------------
  // CANCEL FORM
  // --------------------------------------------------

  const handleCancelForm = () => {
    resetForm();

    // If addresses already exist, hide form
    if (addresses.length > 0) {
      setShowForm(false);
    } else {
      // Don't allow empty state without form
      setShowForm(true);
    }
  };

  return (
    <div className="p-4 sm:p-5">
      {/* --------------------------------------------------
          TITLE
      -------------------------------------------------- */}

      <h2 className="text-base font-semibold text-gray-800 mb-5">
        Manage Addresses
      </h2>

      {loading ? (
        <p className="text-sm text-gray-500">
          Loading addresses...
        </p>
      ) : (
        <>
          {/* --------------------------------------------------
              ADD NEW ADDRESS BUTTON
              Only show when address already exists
          -------------------------------------------------- */}

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

          {/* --------------------------------------------------
              ADDRESS FORM
          -------------------------------------------------- */}

          {showForm && (
            <div className="bg-gray-50 border border-gray-200 rounded p-4 sm:p-6">
              <p className="text-sm font-semibold text-blue-600 mb-5">
                {editingAddress
                  ? "EDIT ADDRESS"
                  : "ADD A NEW ADDRESS"}
              </p>

              {/* Current Location */}
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

                {/* Name */}
                <input
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Name"
                  className={inputCls}
                />

                {/* Mobile */}
                <input
                  value={form.mobile}
                  onChange={update("mobile")}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className={inputCls}
                />

                {/* Pincode */}
                <input
                  value={form.pincode}
                  onChange={update("pincode")}
                  placeholder="Pincode"
                  maxLength={6}
                  className={inputCls}
                />

                {/* Locality */}
                <input
                  value={form.locality}
                  onChange={update("locality")}
                  placeholder="Locality"
                  className={inputCls}
                />

                {/* Address */}
                <textarea
                  value={form.address}
                  onChange={update("address")}
                  placeholder="Address (Area and Street)"
                  rows={3}
                  className={`sm:col-span-2 resize-none ${inputCls}`}
                />

                {/* City */}
                <input
                  value={form.city}
                  onChange={update("city")}
                  placeholder="City/District/Town"
                  className={inputCls}
                />

                {/* State */}
                <select
                  value={form.state}
                  onChange={update("state")}
                  className={`${inputCls} ${form.state === ""
                    ? "text-gray-400"
                    : "text-gray-800"
                    }`}
                >
                  <option value="">
                    --Select State--
                  </option>

                  {indianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>

                {/* Landmark */}
                <input
                  value={form.landmark}
                  onChange={update("landmark")}
                  placeholder="Landmark (Optional)"
                  className={inputCls}
                />

                {/* Alternate Phone */}
                <input
                  value={form.alternatePhone}
                  onChange={update("alternatePhone")}
                  placeholder="Alternate Phone (Optional)"
                  className={inputCls}
                />
              </div>

              {/* --------------------------------------------------
                  ADDRESS TYPE
              -------------------------------------------------- */}

              <div className="mt-5">
                <p className="text-sm text-gray-500 mb-2">
                  Address Type
                </p>

                <div className="flex gap-8">

                  {/* HOME */}
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="addressType"
                      value="Home"
                      checked={
                        form.addressType === "Home"
                      }
                      onChange={update("addressType")}
                      className="accent-blue-600"
                    />

                    Home
                  </label>

                  {/* WORK */}
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="addressType"
                      value="Work"
                      checked={
                        form.addressType === "Work"
                      }
                      onChange={update("addressType")}
                      className="accent-blue-600"
                    />

                    Work
                  </label>

                </div>
              </div>

              {/* --------------------------------------------------
                  BUTTONS
              -------------------------------------------------- */}

              <div className="flex items-center gap-6 mt-6">

                <button
                  type="button"
                  onClick={
                    editingAddress
                      ? handleUpdate
                      : handleSave
                  }
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

          {/* --------------------------------------------------
              SAVED ADDRESS CARDS
          -------------------------------------------------- */}

          {!showForm && addresses.length === 0 && (
            <p className="text-sm text-gray-500 mt-5">
              No saved addresses found.
            </p>
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

                      {/* HOME / WORK */}
                      <span className="inline-block text-xs uppercase mb-3 bg-gray-100 px-2 py-1 rounded">
                        {item.addressType || "HOME"}
                      </span>

                      {/* NAME + MOBILE */}
                      <div className="flex items-center gap-5">
                        <p className="font-semibold text-sm text-gray-800">
                          {item.name || ""}
                        </p>

                        <p className="font-semibold text-sm text-gray-800">
                          {item.mobile || ""}
                        </p>
                      </div>

                      {/* COMPLETE ADDRESS */}
                      <p className="text-sm text-gray-700 mt-4">
                        {item.address || ""}

                        {item.address && item.locality ? ", " : ""}
                        {item.locality || ""}

                        {item.locality && item.city ? ", " : ""}
                        {item.city || ""}

                        {item.city && item.state ? ", " : ""}
                        {item.state || ""}

                        {item.state && item.pincode ? " - " : ""}

                        <strong>
                          {item.pincode || ""}
                        </strong>
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
                          setOpenMenu(
                            openMenu === item._id ? null : item._id
                          )
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



/* ---------- Page ---------- */

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("male");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("+91");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Profile Information");

  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingMobile, setEditingMobile] = useState(false);



  useEffect(() => {
    window.scrollTo(0, 0);
    setFirstName(user?.username || "");
    setEmail(user?.email || "");
  }, [user]);

  const inputClass = (editing) =>
    `border rounded px-3 py-2 text-sm focus:outline-none ${editing
      ? "border-gray-300 bg-white text-gray-800 focus:border-blue-500"
      : "border-gray-200 bg-gray-50 text-gray-400"
    }`;

  return (
    <>
      <Navbar2 />

      <div className="pt-28 md:pt-24">
        <div className="min-h-screen bg-gray-200 py-6 px-4">

          {/* Mobile Sidebar Button */}
          <div className="md:hidden mb-4">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen((prev) => !prev)}
              className="w-full flex items-center justify-between bg-white px-4 py-3 rounded shadow-sm text-sm font-semibold text-gray-800"
            >
              <span>My Account</span>

              <span className="text-xl leading-none">
                {mobileSidebarOpen ? "🗙" : "☰"}
              </span>
            </button>
          </div>
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-4">
            {/* ---------- Sidebar ---------- */}
            <aside
              className={`w-full md:w-64 shrink-0 space-y-3 ${mobileSidebarOpen ? "block" : "hidden"
                } md:block`}
            >
              <div className="bg-white rounded shadow-sm">
                {/* Hello, user */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
                  <img className="size-10 mr-1" src={ProfileAvatar} alt="" />
                  <div>
                    <p className="text-xs text-gray-500">Hello,</p>
                    <p className="wrap-break-word text-sm font-semibold text-gray-800">{firstName} {lastName}</p>
                  </div>
                </div>

                {/* My Orders */}
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="w-full flex items-center justify-between cursor-pointer px-4 py-3 border-b text-gray-800  border-gray-100 hover:text-blue-600  hover:bg-gray-50"
                >
                  <span className="flex items-center gap-3 text-sm font-semibold">
                    <img className="size-5" src={MyOrdersIcon} alt="" />
                    MY ORDERS
                  </span>
                </button>

                {/* Account Settings */}
                <div className="border-b border-gray-100 py-3">
                  <div className="flex items-center gap-3 px-4 text-sm font-semibold text-gray-800">
                    <img className="size-5" src={AccountSettingsIcon} alt="" />
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
                    <img className="size-5" src={PaymentsIcon} alt="" />
                    PAYMENTS
                  </div>
                  <ul className="mt-2">
                    {paymentsLinks.map((link) => (
                      <li key={link.label}>
                        <button
                          onClick={() => setMobileSidebarOpen(false)}
                          className="w-full flex cursor-pointer items-center justify-between pl-11 pr-4 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                        >
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
                    <img className="size-5" src={MyStuffIcon} alt="" />
                    MY STUFF
                  </div>
                  <ul className="mt-2">
                    {stuffLinks.map((link) => (
                      <li key={link}>
                        <button
                          onClick={() => setMobileSidebarOpen(false)}
                          className="w-full cursor-pointer text-left pl-11 pr-4 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                        >
                          {link}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Logout */}
                <button onClick={async () => { setMobileSidebarOpen(false); await logout(); navigate("/"); }} className="w-full flex items-center gap-3 px-4 py-3 text-base font-semibold text-gray-500 hover:text-blue-600 transition-colors duration-200">
                  Logout
                </button>

              </div>

              {/* Frequently visited */}
              <div className="bg-white rounded shadow-sm px-4 py-3">
                <p className="text-xs font-semibold text-gray-500 mb-2">Frequently Visited</p>
                <div className="flex gap-4 text-xs text-gray-400">
                  <span>Track Order</span>
                  <span>Help Center</span>
                </div>
              </div>
            </aside>

            {/* ---------- Main content ---------- */}
            <main className="min-w-0 flex-1 rounded bg-white shadow-sm relative">
              {activeLink === "Manage Addresses" ? (
                <ManageAddresses onCancel={() => setActiveLink("Profile Information")} />
              ) : (
                <div className="p-4 pb-0 sm:p-5 sm:pb-0">
                  {/* Personal Information */}
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-base font-semibold text-gray-800">
                      Personal Information
                    </h2>

                    <button
                      onClick={() => setEditingPersonal((v) => !v)}
                      className="text-sm cursor-pointer text-blue-600 font-medium"
                    >
                      {editingPersonal ? "Cancel" : "Edit"}
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={!editingPersonal}
                      placeholder="First Name"
                      className={`min-w-0 flex-1 ${inputClass(editingPersonal)}`}
                    />

                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={!editingPersonal}
                      placeholder="Last Name"
                      className={`min-w-0 flex-1 ${inputClass(editingPersonal)}`}
                    />

                    {editingPersonal && (
                      <button
                        onClick={() => setEditingPersonal(false)}
                        className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white text-sm font-semibold px-8 py-2 rounded"
                      >
                        SAVE
                      </button>
                    )}
                  </div>

                  {/* Gender */}
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-800 mb-2">
                      Your Gender
                    </p>

                    <div className="flex gap-8">
                      {["male", "female"].map((g) => (
                        <label
                          key={g}
                          className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="gender"
                            checked={gender === g}
                            onChange={() => setGender(g)}
                            disabled={!editingPersonal}
                            className="accent-blue-600"
                          />

                          {g === "male" ? "Male" : "Female"}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-sm font-semibold text-gray-800">
                        Email Address
                      </h3>

                      <button
                        onClick={() => setEditingEmail((v) => !v)}
                        className="text-sm cursor-pointer text-blue-600 font-medium"
                      >
                        {editingEmail ? "Cancel" : "Edit"}
                      </button>
                    </div>

                    <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!editingEmail}
                        placeholder="Email Address"
                        className={`min-w-0 flex-1 ${inputClass(editingEmail)}`}
                      />

                      {editingEmail && (
                        <button
                          onClick={() => setEditingEmail(false)}
                          className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white text-sm font-semibold px-8 py-2 rounded"
                        >
                          SAVE
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Mobile */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-sm font-semibold text-gray-800">
                        Mobile Number
                      </h3>

                      <button
                        onClick={() => setEditingMobile((v) => !v)}
                        className="text-sm cursor-pointer text-blue-600 font-medium"
                      >
                        {editingMobile ? "Cancel" : "Edit"}
                      </button>
                    </div>

                    <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
                      <input
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        disabled={!editingMobile}
                        placeholder="Mobile Number"
                        className={`min-w-0 flex-1 ${inputClass(editingMobile)}`}
                      />

                      {editingMobile && (
                        <button
                          onClick={() => setEditingMobile(false)}
                          className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white text-sm font-semibold px-8 py-2 rounded"
                        >
                          SAVE
                        </button>
                      )}
                    </div>
                  </div>

                  {/* FAQs */}
                  <div className="mb-8">
                    <h3 className="text-base font-semibold text-gray-800 mb-3">
                      FAQs
                    </h3>

                    <div className="space-y-4">
                      {faqs.map((item) => (
                        <div key={item.q}>
                          <p className="text-xs font-semibold text-gray-800">
                            {item.q}
                          </p>

                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            {item.a}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Deactivate / Delete */}
                  <div className="flex flex-col gap-2 mb-2">
                    <button className="text-sm text-blue-600 cursor-pointer font-medium text-left w-fit">
                      Deactivate Account
                    </button>

                    <button className="text-sm text-red-500 cursor-pointer font-medium text-left w-fit">
                      Delete Account
                    </button>
                  </div>


                  {/* Decorative footer */}
                  <div className="mt-4 -mx-4 sm:-mx-5 overflow-hidden">
                    <img
                      src={FooterArt}
                      alt=""
                      className="block w-full h-auto"
                    />
                  </div>
                </div>
              )}




            </main>
          </div>
        </div>

      </div>
      <Footer />
    </>
  );
}
