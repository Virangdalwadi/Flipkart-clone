import React, { useEffect } from "react";

const confirmColors = {
  success: "text-[#2874f0]",
  error: "text-[#2874f0]",
  warning: "text-[#2874f0]",
  info: "text-[#2874f0]",
};


const Popup = ({
  show,
  type = "info",
  title = "Notification",
  message,
  onClose,
  onConfirm,
  showOkButton = true,
  confirmButtonText = "OK",
  cancelButtonText = "Cancel",
}) => {
  useEffect(() => {
    if (!show) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [show, onClose]);

  if (!show) return null;

  const confirmClass = confirmColors[type] || confirmColors.info;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-md bg-white shadow-2xl"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="popup-title"
        aria-describedby="popup-message"
      >
        {/* Content */}
        <div className="px-6 pb-6 pt-5">
          <h2 id="popup-title" className="wrap-break-word text-base font-semibold text-gray-900">
            {title}
          </h2>
          <p id="popup-message" className="mt-4 wrap-break-word text-sm leading-6 text-gray-600">
            {message}
          </p>
        </div>

        {/* Footer buttons */}
        {showOkButton && (
          <div className="grid divide-x divide-gray-200 border-t border-gray-200 sm:divide-x"
            style={onConfirm ? { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" } : undefined}>
            {onConfirm ? (
              <>
                <button
                  type="button"
                  onClick={onConfirm}
                  className="py-4 text-sm font-bold text-gray-600 cursor-pointer focus:outline-none focus-visible:bg-gray-50"
                >
                  {confirmButtonText}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-4 text-sm font-bold text-gray-600 cursor-pointer focus:outline-none focus-visible:bg-gray-50"
                >
                  {cancelButtonText}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="py-4 text-sm font-bold text-gray-600 cursor-pointer focus:outline-none focus-visible:bg-gray-50"

              >
                {confirmButtonText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Popup;
