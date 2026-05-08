import type { ReactNode } from "react";
import clsx from "clsx";

type Props = {
  children: ReactNode;
  className?: string;
};

export function PageBody({ children, className }: Props) {
  return (
    <main
      className={clsx(
        "flex flex-1 flex-col bg-background px-6 py-8",
        className,
      )}
    >
      {children}
    </main>
  );
}
