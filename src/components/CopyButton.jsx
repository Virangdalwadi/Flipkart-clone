import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button type="button" onClick={handleCopy} className="ml-1.5 inline-flex items-center text-blue-500">
      {copied ? <Check className="h-4 w-4 text-blue-600" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}

