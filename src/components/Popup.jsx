import React, { useEffect } from "react";

const popupStyles = {
  success: {
    icon: "✓",
    iconClass: "bg-green-100 text-green-700",
    titleClass: "text-green-800",
  },
  error: {
    icon: "!",
    iconClass: "bg-red-100 text-red-700",
    titleClass: "text-red-800",
  },
  warning: {
    icon: "!",
    iconClass: "bg-amber-100 text-amber-700",
    titleClass: "text-amber-800",
  },
  info: {
    icon: "i",
    iconClass: "bg-blue-100 text-blue-700",
    titleClass: "text-blue-800",
  },
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

  const style = popupStyles[type] || popupStyles.info;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 transition-opacity duration-200"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-sm scale-100 rounded-xl bg-white p-6 shadow-2xl transition-transform duration-200"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="popup-title"
        aria-describedby="popup-message"
      >
        <div className="flex items-start gap-4">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl font-bold ${style.iconClass}`}>
            {style.icon}
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="popup-title" className={`break-words text-lg font-semibold ${style.titleClass}`}>
              {title}
            </h2>
            <p id="popup-message" className="mt-2 break-words text-sm leading-6 text-gray-600">
              {message}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl px-2 py-1 text-2xl leading-none text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
        {showOkButton && (
          <div className="mt-6 flex justify-end gap-3">
            {onConfirm && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={onConfirm || onClose}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              {confirmButtonText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Popup;
