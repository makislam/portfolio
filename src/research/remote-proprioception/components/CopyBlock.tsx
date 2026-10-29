import { useState } from "react";

export default function CopyBlock({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative">
      <pre className="overflow-x-auto rounded-2xl border border-line bg-card p-5 font-mono text-[12.5px] leading-relaxed text-ink-2">{text}</pre>
      <button
        onClick={() => {
          navigator.clipboard?.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          });
        }}
        className="absolute right-3 top-3 rounded-full border border-line bg-white px-3 py-1 text-[11px] font-medium"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
