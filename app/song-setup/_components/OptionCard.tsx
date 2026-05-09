"use client";

import clsx from "clsx";

type Props = {
  label: string;
  selected: boolean;
  onSelect: () => void;
};

export function OptionCard({ label, selected, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={clsx(
        "w-full rounded-lg border-2 px-4 py-4 text-left text-sm font-semibold uppercase tracking-wide transition-colors select-none",
        selected
          ? "border-primary bg-primary text-white"
          : "border-gray-300 bg-white text-gray-700 hover:border-primary/50",
      )}
    >
      {label}
    </button>
  );
}
