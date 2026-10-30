import { useEffect, useRef, useState } from "react";
import FooterArt from "../../assets/images/Profile Page Image/Footer.png";
import ProfileAvatarFallback from "../../assets/images/Profile Page Image/ProfileAvatar.svg";
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
const PROFILE_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
const PROFILE_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

// firstName / lastName live in the parent because the sidebar and
// mobile header also display them.
export default function ProfileInformation({
  firstName,
  setFirstName,
  lastName,
  setLastName,
}) {
  const { user, updateProfile, updateProfileImage, removeProfileImage } = useAuth();
  const imageInputRef = useRef(null);

  const [gender, setGender] = useState(user?.gender || "");
  const [email, setEmail] = useState(user?.email || "");
  const [mobile, setMobile] = useState(user?.mobile || "");
  
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingMobile, setEditingMobile] = useState(false);
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingMobile, setSavingMobile] = useState(false);
  const [personalError, setPersonalError] = useState("");
  const [mobileError, setMobileError] = useState("");

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState("");
  const [photoFailed, setPhotoFailed] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoOperation, setPhotoOperation] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [photoMessage, setPhotoMessage] = useState("");

  useEffect(
    () => () => {
      if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    },
    [photoPreviewUrl],
  );

  useEffect(() => {
    setEmail(user?.email || "");
    setGender(user?.gender || "");
    setMobile(user?.mobile || "");
  }, [user]);

  const cancelPersonalEdit = () => {
    setFirstName(user?.username || "");
    setLastName(user?.lastName || "");
    setGender(user?.gender || "");
    setPersonalError("");
    setEditingPersonal(false);
  };

  const savePersonalInformation = async () => {
    setSavingPersonal(true);
    setPersonalError("");
    try {
      await updateProfile({
        username: firstName,
        lastName,
        ...(gender ? { gender } : {}),
      });
      setEditingPersonal(false);
    } catch (error) {
      setPersonalError(
        error.response?.data?.message || "Unable to save personal information.",
      );
    } finally {
      setSavingPersonal(false);
    }
  };

  const cancelMobileEdit = () => {
    setMobile(user?.mobile || "");
    setMobileError("");
    setEditingMobile(false);
  };

  const saveMobile = async () => {
    setSavingMobile(true);
    setMobileError("");
    try {
      await updateProfile({ mobile: mobile.trim() });
      setEditingMobile(false);
    } catch (error) {
      setMobileError(
        error.response?.data?.message || "Unable to save mobile number.",
      );
    } finally {
      setSavingMobile(false);
    }
  };

  const selectPhoto = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setPhotoError("");
    setPhotoMessage("");
    if (!PROFILE_IMAGE_TYPES.has(file.type)) {
      setPhotoError("Choose a JPG, JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > PROFILE_IMAGE_MAX_BYTES) {
      setPhotoError("Choose an image that is 5 MB or smaller.");
      return;
    }

    setPhotoFailed(false);
    setSelectedPhoto(file);
    setPhotoPreviewUrl(URL.createObjectURL(file));
  };

  const cancelPhotoPreview = () => {
    setSelectedPhoto(null);
    setPhotoPreviewUrl("");
    setPhotoError("");
    setPhotoMessage("");
    setPhotoFailed(false);
  };

  const uploadPhoto = async () => {
    if (!selectedPhoto) return;
    setPhotoBusy(true);
    setPhotoOperation("upload");
    setPhotoError("");
    setPhotoMessage("");
    try {
      const result = await updateProfileImage(selectedPhoto);
      setSelectedPhoto(null);
      setPhotoPreviewUrl("");
      setPhotoFailed(false);
      setPhotoMessage(
        result.warning
          ? `Profile photo updated. ${result.warning}`
          : "Profile photo updated successfully.",
      );
    } catch (error) {
      setPhotoError(
        error.response?.data?.message || "Unable to upload profile photo.",
      );
    } finally {
      setPhotoBusy(false);
      setPhotoOperation("");
    }
  };

  const removePhoto = async () => {
    setPhotoBusy(true);
    setPhotoOperation("remove");
    setPhotoError("");
    setPhotoMessage("");
    try {
      const result = await removeProfileImage();
      cancelPhotoPreview();
      setPhotoMessage(
        result.warning
          ? `Profile photo removed. ${result.warning}`
          : "Profile photo removed successfully.",
      );
    } catch (error) {
      setPhotoError(
        error.response?.data?.message || "Unable to remove profile photo.",
      );
    } finally {
      setPhotoBusy(false);
      setPhotoOperation("");
    }
  };

  return (
    <div className="p-4 pb-0 sm:p-8 sm:pb-0">
      {/* Profile Photo */}
      <section className="mb-8" aria-labelledby="profile-photo-heading">
        <h2
          id="profile-photo-heading"
          className="mb-4 text-base font-semibold text-gray-800"
        >
          Profile Photo
        </h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <img
            src={
              (photoPreviewUrl || user?.profileImage) && !photoFailed
                ? photoPreviewUrl || user.profileImage
                : ProfileAvatarFallback
            }
            alt="Profile photo preview"
            className="size-20 rounded-full border border-gray-200 object-cover"
            onError={() => setPhotoFailed(true)}
          />
          <div className="flex flex-wrap gap-3">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
              onChange={selectPhoto}
              className="sr-only"
              aria-label="Choose a profile photo"
            />
            {!selectedPhoto && (
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                disabled={photoBusy}
                className={`${saveBtnCls} disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {user?.profileImage ? "Change Photo" : "Upload Photo"}
              </button>
            )}
            {selectedPhoto && (
              <>
                <button
                  type="button"
                  onClick={uploadPhoto}
                  disabled={photoBusy}
                  className={`${saveBtnCls} disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  {photoOperation === "upload" ? "UPLOADING..." : "Save Photo"}
                </button>
                <button
                  type="button"
                  onClick={cancelPhotoPreview}
                  disabled={photoBusy}
                  className="cursor-pointer rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
              </>
            )}
            <button
              type="button"
              onClick={removePhoto}
              disabled={photoBusy || !user?.profileImage}
              className="cursor-pointer rounded border-2 border-red-300 px-4 py-2 text-sm font-semibold text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {photoOperation === "remove" ? "REMOVING..." : "Remove Photo"}
            </button>
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          JPG, PNG, or WebP. Maximum file size: 5 MB.
        </p>
        {photoError && (
          <p role="alert" className="mt-2 text-sm text-red-600">
            {photoError}
          </p>
        )}
        {photoMessage && (
          <p role="status" className="mt-2 text-sm text-green-700">
            {photoMessage}
          </p>
        )}
      </section>

      {/* Personal Information */}
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-base font-semibold text-gray-800">
          Personal Information
        </h2>

        <button
          onClick={() =>
            editingPersonal ? cancelPersonalEdit() : setEditingPersonal(true)
          }
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
          className={`w-full sm:w-60 ${inputClass(editingPersonal)}`}
        />

        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          disabled={!editingPersonal}
          placeholder="Last Name"
          className={`w-full sm:w-60 ${inputClass(editingPersonal)}`}
        />

        {editingPersonal && (
          <button
            type="button"
            onClick={savePersonalInformation}
            disabled={savingPersonal}
            className={`${saveBtnCls} disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {savingPersonal ? "SAVING..." : "SAVE"}
          </button>
        )}
      </div>
      {personalError && (
        <p role="alert" className="mb-4 text-sm text-red-600">
          {personalError}
        </p>
      )}

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
            className={`w-full sm:w-60 ${inputClass(editingEmail)}`}
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
            onClick={() =>
              editingMobile ? cancelMobileEdit() : setEditingMobile(true)
            }
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
            inputMode="numeric"
            maxLength={10}
            className={`w-full sm:w-60 ${inputClass(editingMobile)}`}
          />

          {editingMobile && (
            <button
              type="button"
              onClick={saveMobile}
              disabled={savingMobile}
              className={`${saveBtnCls} disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {savingMobile ? "SAVING..." : "SAVE"}
            </button>
          )}
        </div>
        {mobileError && (
          <p role="alert" className="mt-2 text-sm text-red-600">
            {mobileError}
          </p>
        )}
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
