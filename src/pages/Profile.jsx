import { useState } from "react";
import MyOrdersIcon from "../assets/Profile Page Image/My ORDERS.svg"
import ProfileAvatar from "../assets/Profile Page Image/ProfileAvatar.svg"
import AccountSettingsIcon from "../assets/Profile Page Image/ACCOUNT SETTINGS.svg"
import PaymentsIcon from "../assets/Profile Page Image/PAYMENTS.svg"
import MyStuffIcon from "../assets/Profile Page Image/MY STUFF.svg"
import LogoutIcon from "../assets/Profile Page Image/Logout.svg"
import FooterArt from "../assets/Profile Page Image/Footer.png"
import Footer from "../components/Footer";
import Navbar3 from "../components/Navbar3";

/* ---------- Sidebar nav data ---------- */

const settingsLinks = ["Profile Information", "Manage Addresses", "PAN Card Information"];
const paymentsLinks = [
  { label: "Gift Cards", trailing: "₹0" },
  { label: "Saved UPI" },
  { label: "Saved Cards" },
];
const stuffLinks = ["My Coupons", "My Reviews & Ratings", "All Notifications", "My Wishlist"];

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

/* ---------- Page ---------- */

export default function ProfilePage() {
  const [firstName, setFirstName] = useState("Virang");
  const [lastName, setLastName] = useState("Dalwadi");
  const [gender, setGender] = useState("male");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("+91");
  const [activeLink, setActiveLink] = useState("Profile Information");

  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingMobile, setEditingMobile] = useState(false);

  const inputClass = (editing) =>
    `border rounded px-3 py-2 text-sm focus:outline-none ${editing
      ? "border-gray-300 bg-white text-gray-800 focus:border-blue-500"
      : "border-gray-200 bg-gray-50 text-gray-400"
    }`;

  return (
    <>
      <Navbar3 />
      <div className="mt-17">
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
                    <p className="text-sm font-semibold text-gray-800">{firstName} {lastName}</p>
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
                            : "text-gray-600 hover:text-gray-900"
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
                        <button className="w-full flex items-center justify-between pl-11 pr-4 py-1.5 text-sm text-gray-600 hover:text-gray-900">
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
                        <button className="w-full text-left pl-11 pr-4 py-1.5 text-sm text-gray-600 hover:text-gray-900">
                          {link}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Logout */}
                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200">
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
            <main className="flex-1 bg-white rounded shadow-sm relative overflow-hidden">
              <div className="p-5 pb-0">
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
                    className={`flex ${inputClass(editingPersonal)}`}
                  />
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={!editingPersonal}
                    placeholder="Last Name"
                    className={`flex ${inputClass(editingPersonal)}`}
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
                  <div className="flex gap-4">
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!editingEmail}
                      placeholder="Email Address"
                      className={`flex ${inputClass(editingEmail)}`}
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
                  <div className="flex gap-4">
                    <input
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      disabled={!editingMobile}
                      placeholder="Mobile Number"
                      className={`flex ${inputClass(editingMobile)}`}
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
