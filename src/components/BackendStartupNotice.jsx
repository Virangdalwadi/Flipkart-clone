import { useEffect, useRef, useState } from "react";
import { subscribeToBackendAvailability } from "../api/axiosInstance";

const STARTUP_DELAY_MS = 4000;
const NOTICE_SEEN_KEY = "backendStartupNoticeShown";

const hasShownNotice = () => {
  try {
    return sessionStorage.getItem(NOTICE_SEEN_KEY) === "true";
  } catch {
    return false;
  }
};

const markNoticeAsShown = () => {
  try {
    sessionStorage.setItem(NOTICE_SEEN_KEY, "true");
  } catch {
    // The notice still works when browser storage is unavailable.
  }
};

const BackendStartupNotice = () => {
  const [notice, setNotice] = useState(null);
  const noticeRef = useRef(null);

  useEffect(() => {
    let currentStatus = "idle";
    let checkStartedAt = 0;
    let timerId;

    const updateNotice = (nextNotice) => {
      noticeRef.current = nextNotice;
      setNotice(nextNotice);
    };

    const unsubscribe = subscribeToBackendAvailability(({ status }) => {
      currentStatus = status;
      window.clearTimeout(timerId);

      if (status === "checking") {
        checkStartedAt = Date.now();
        if (hasShownNotice()) return;

        timerId = window.setTimeout(() => {
          if (currentStatus !== "checking" || hasShownNotice()) return;
          markNoticeAsShown();
          updateNotice("starting");
        }, STARTUP_DELAY_MS);
        return;
      }

      if (status === "ready") {
        updateNotice(null);
        return;
      }

      if (status === "error") {
        const slowConnection = Date.now() - checkStartedAt >= STARTUP_DELAY_MS;
        if (noticeRef.current === "starting" || (slowConnection && !hasShownNotice())) {
          markNoticeAsShown();
          updateNotice("error");
        }
      }
    });

    return () => {
      window.clearTimeout(timerId);
      unsubscribe();
    };
  }, []);

  if (!notice) return null;

  const isError = notice === "error";

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm">
      <section
        aria-modal="true"
        aria-labelledby="backend-notice-title"
        aria-describedby="backend-notice-message"
        className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8"
        role="alertdialog"
      >
        <div className="flex flex-col items-center text-center">
          {isError ? (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl font-semibold text-red-700">
              !
            </div>
          ) : (
            <div
              aria-label="Connecting to backend"
              className="h-12 w-12 animate-spin rounded-full border-[3px] border-slate-200 border-t-blue-600"
              role="status"
            />
          )}

          <h2 id="backend-notice-title" className="mt-5 text-xl font-semibold text-slate-900">
            {isError ? "Backend unavailable" : "Initializing Backend Services"}
          </h2>
          <p id="backend-notice-message" className="mt-3 text-sm leading-6 text-slate-600">
            {isError
              ? "The backend could not be reached. Check your connection or try again later."
              : "This project uses a live backend hosted on Render. If the server has been inactive, its first startup may take 1–2 minutes. Please wait while the server wakes up. Thank you!"}
          </p>

          {isError && (
            <button
              className="mt-6 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
              onClick={() => {
                noticeRef.current = null;
                setNotice(null);
              }}
              type="button"
            >
              Dismiss
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default BackendStartupNotice;
