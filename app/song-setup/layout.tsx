import type { ReactNode } from "react";

export default function SongSetupLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <h2 className="pt-6 text-center text-xl font-bold uppercase tracking-wide">
        Song Setup
      </h2>
      {children}
    </div>
  );
}
