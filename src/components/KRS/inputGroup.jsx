// components/KRS/InputGroup.jsx
import { de } from "@faker-js/faker";
import { useState } from "react";

const InputGroup = ({ label, value, onChange, placeholder }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div>
      <label className="block font-semibold text-xs text-slate-400 uppercase mb-1">
        {label}
      </label>
      <div className="flex relative">
        <input
          className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 pr-10 focus:ring-2 focus:ring-purple-500 outline-none text-white text-sm"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
        <button
          onClick={handleCopy}
          title="Copy"
          className="absolute right-1 top-1 bottom-1 px-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded"
        >
          {copied ? "✓" : "⧉"}
        </button>
      </div>
    </div>
  );
};

export default InputGroup;
