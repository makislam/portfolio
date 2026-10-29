// Selects a take in the hero explorer and scrolls up to it.
export default function TakeLink({ id, label }: { id: string; label: string }) {
  return (
    <button
      onClick={() => {
        window.dispatchEvent(new CustomEvent("select-take", { detail: id }));
        document.getElementById("top")?.scrollIntoView({ behavior: "smooth" });
      }}
      className="rounded-full border border-line px-2.5 py-1 text-[11.5px] font-medium text-ink-2 hover:border-pred hover:text-pred"
    >
      ▶ {label}
    </button>
  );
}
