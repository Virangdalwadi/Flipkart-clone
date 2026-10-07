import { useEffect, useState } from "react";
import FooterArt from "../../assets/images/Profile Page Image/Footer.png";
import { useAuth } from "../../context/AuthContext";

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

const inputClass = (editing) =>
  `border rounded px-3 py-2 text-sm focus:outline-none ${editing
    ? "border-gray-300 bg-white text-gray-800 focus:border-blue-500"
    : "border-gray-200 bg-gray-50 text-gray-400"
  }`;

const saveBtnCls =
  "bg-blue-600 hover:bg-blue-700 cursor-pointer text-white text-sm font-semibold px-8 py-2 rounded";

// firstName / lastName live in the parent because the sidebar and
// mobile header also display them.
export default function ProfileInformation({
  firstName,
  setFirstName,
  lastName,
  setLastName,
}) {
  const { user } = useAuth();

  const [gender, setGender] = useState("male");
  const [email, setEmail] = useState(user?.email || "");
  const [mobile, setMobile] = useState("+91");

  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingMobile, setEditingMobile] = useState(false);

  useEffect(() => {
    setEmail(user?.email || "");
  }, [user]);

  return (
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
          <button onClick={() => setEditingPersonal(false)} className={saveBtnCls}>
            SAVE
          </button>
        )}
      </div>

      {/* Gender */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-800 mb-2">Your Gender</p>

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
          <h3 className="text-sm font-semibold text-gray-800">Email Address</h3>

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
            <button onClick={() => setEditingEmail(false)} className={saveBtnCls}>
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
            <button onClick={() => setEditingMobile(false)} className={saveBtnCls}>
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

      {/* Decorative footer */}
      <div className="mt-4 -mx-4 sm:-mx-5 overflow-hidden">
        <img width="848"
          height="154" src={FooterArt} alt="" className="block w-full h-auto" />
      </div>
    </div>
  );
}
