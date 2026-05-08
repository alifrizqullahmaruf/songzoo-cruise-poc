import type { ReactNode } from "react";
import { CruiseHeader } from "./CruiseHeader";
import { SongZooFooter } from "./SongZooFooter";

type Props = {
  children: ReactNode;
};

export function PhoneShell({ children }: Props) {
  return (
    <div className="flex min-h-dvh w-full justify-center bg-shell">
      <div className="flex w-full max-w-[430px] flex-col bg-background shadow-2xl sm:my-4 sm:overflow-hidden sm:rounded-2xl">
        <CruiseHeader />
        <div className="flex flex-1 flex-col">{children}</div>
        <SongZooFooter />
      </div>
    </div>
  );
}
