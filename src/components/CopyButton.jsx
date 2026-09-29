import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheck } from "@fortawesome/free-solid-svg-icons";

export default function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation(); // stops parent click handlers, e.g. a clickable order card
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? "Copied!" : "Copy"}
      aria-label="Copy order ID"
      className="ml-1.5 inline-flex cursor-pointer items-center text-blue-500 transition-colors"
    >
      <FontAwesomeIcon
        icon={copied ? faCheck : faCopy}
        className={copied ? "text-blue-600" : ""}
      />
    </button>
  );
}
