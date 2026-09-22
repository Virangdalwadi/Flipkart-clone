import { useEffect, useState } from "react";
import MyOrdersIcon from "../assets/Profile Page Image/My ORDERS.svg"
import ProfileAvatar from "../assets/Profile Page Image/ProfileAvatar.svg"
import AccountSettingsIcon from "../assets/Profile Page Image/ACCOUNT SETTINGS.svg"
import PaymentsIcon from "../assets/Profile Page Image/PAYMENTS.svg"
import MyStuffIcon from "../assets/Profile Page Image/MY STUFF.svg"
import LogoutIcon from "../assets/Profile Page Image/Logout.svg"
import FooterArt from "../assets/Profile Page Image/Footer.png"
import Footer from "../components/Footer";
import Navbar3 from "../components/Navbar3";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance.jsx";

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
  altPhone: "",
  addressType: "home",
};

function ManageAddresses({ onCancel }) {
  const [form, setForm] = useState(initialAddressForm);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);

        const response = await getAddresses();

        setAddresses(response.data || []);
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
        setAddresses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const inputCls =
    "w-full min-w-0 border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 bg-white";

  const handleSave = () => {
    // TODO: wire up to your addresses API (POST /api/addresses)
    onCancel();
  };

  return (
    <div className="p-4 sm:p-5">
      <h2 className="text-base font-semibold text-gray-800 mb-4">Manage Addresses</h2>

      {loading ? (
        <p className="text-sm text-gray-500 mb-4">
          Loading addresses...
        </p>
      ) : addresses.length > 0 ? (
        <div className="space-y-3 mb-6">
          {addresses.map((item) => (
            <div
              key={item._id}
              className="border border-gray-200 rounded p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm text-gray-800">
                    {item.name ?? ""}
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    {item.mobile ?? ""}
                  </p>
                </div>

                <span className="text-xs uppercase bg-gray-100 px-2 py-1 rounded">
                  {item.addressType ?? "home"}
                </span>
              </div>

              <p className="text-sm text-gray-600 mt-3">
                {item.address ?? ""}
              </p>

              <p className="text-sm text-gray-600">
                {item.locality ?? ""}
                {item.locality ? ", " : ""}
                {item.city ?? ""}
                {item.city ? ", " : ""}
                {item.state ?? ""}
                {item.state ? " - " : ""}
                {item.pincode ?? ""}
              </p>

              {item.landmark && (
                <p className="text-sm text-gray-500 mt-1">
                  Landmark: {item.landmark}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 mb-4">
          No saved addresses found.
        </p>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded p-4 sm:p-6">
        <p className="text-sm font-semibold text-blue-600 mb-4">ADD A NEW ADDRESS</p>

        <button
          type="button"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded mb-5"
        >
          <LocationPinIcon />
          Use my current location
        </button>

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
            className={inputCls}
          />

          <input
            value={form.pincode}
            onChange={update("pincode")}
            placeholder="Pincode"
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
            className={`${inputCls} text-gray-800 ${form.state === "" ? "text-gray-400" : ""}`}
          >
            <option value="">--Select State--</option>
            {indianStates.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <input
            value={form.landmark}
            onChange={update("landmark")}
            placeholder="Landmark (Optional)"
            className={inputCls}
          />
          <input
            value={form.altPhone}
            onChange={update("altPhone")}
            placeholder="Alternate Phone (Optional)"
            className={inputCls}
          />
        </div>

        <div className="mt-5">
          <p className="text-sm text-gray-500 mb-2">Address Type</p>
          <div className="flex gap-8">
            {["home", "work"].map((type) => (
              <label key={type} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="addressType"
                  checked={form.addressType === type}
                  onChange={() => setForm((f) => ({ ...f, addressType: type }))}
                  className="accent-blue-600"
                />
                {type === "home" ? "Home" : "Work"}
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6 mt-6">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-10 py-2.5 rounded"
          >
            SAVE
          </button>
          <button
            onClick={onCancel}
            className="text-sm text-blue-600 font-medium hover:underline"
          >
            CANCEL
          </button>
        </div>
      </div>
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
      <Navbar3 />
      <div className="pt-28 md:pt-24">
        <div className="min-h-screen bg-gray-200 py-6 px-4">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-4">
            {/* ---------- Sidebar ---------- */}
            <aside className="w-full md:w-64 shrink-0 space-y-3">
              <div className="bg-white rounded shadow-sm">
                {/* Hello, user */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
                  <img className="size-10 mr-1" src={ProfileAvatar} alt="" />
                  <div>
                    <p className="text-xs text-gray-500">Hello,</p>
                    <p className="break-words text-sm font-semibold text-gray-800">{firstName} {lastName}</p>
                  </div>
                </div>

                {/* My Orders */}
                <button className="w-full flex items-center justify-between px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
                  <span className="flex items-center gap-3 text-sm font-semibold text-gray-800">
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
                          className={`w-full text-left pl-11 pr-4 py-1.5 text-sm ${activeLink === link
                            ? "text-blue-600 bg-blue-50 font-medium"
                            : " hover:text-blue-600 "
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
                        <button className="w-full flex items-center justify-between pl-11 pr-4 py-1.5 text-sm text-gray-600 hover:text-blue-600">
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
                        <button className="w-full text-left pl-11 pr-4 py-1.5 text-sm text-gray-600 hover:text-blue-600 ">
                          {link}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Logout */}
                <button onClick={async () => { await logout(); navigate("/"); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200">
                  <img className="size-7 bold" src={LogoutIcon} alt="Logout" />
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
                    <h2 className="text-base font-semibold text-gray-800">Personal Information</h2>
                    <button
                      onClick={() => setEditingPersonal((v) => !v)}
                      className="text-sm text-blue-600 font-medium"
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
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-8 py-2 rounded"
                      >
                        SAVE
                      </button>
                    )}
                  </div>

                  {/* Gender */}
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-800 mb-2">Your Gender</p>
                    <div className="flex gap-8">
                      {["male", "female"].map((g) => (
                        <label key={g} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
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
                      <h3 className="text-sm font-semibold text-gray-800">Email Address</h3>
                      <button
                        onClick={() => setEditingEmail((v) => !v)}
                        className="text-sm text-blue-600 font-medium"
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
                          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-8 py-2 rounded"
                        >
                          SAVE
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Mobile */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-sm font-semibold text-gray-800">Mobile Number</h3>
                      <button
                        onClick={() => setEditingMobile((v) => !v)}
                        className="text-sm text-blue-600 font-medium"
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
                          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-8 py-2 rounded"
                        >
                          SAVE
                        </button>
                      )}
                    </div>
                  </div>

                  {/* FAQs */}
                  <div className="mb-8">
                    <h3 className="text-base font-semibold text-gray-800 mb-3">FAQs</h3>
                    <div className="space-y-4">
                      {faqs.map((item) => (
                        <div key={item.q}>
                          <p className="text-xs font-semibold text-gray-800">{item.q}</p>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.a}</p>
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
                </div>
              )}

              {/* Decorative footer */}
              <div className="mt-4 relative h-36">
                <img src={FooterArt} alt="" />
              </div>
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
