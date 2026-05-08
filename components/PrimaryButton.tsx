"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type Variant = "primary" | "ghost";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
};

export function PrimaryButton({
  children,
  variant = "primary",
  disabled,
  className,
  type = "button",
  ...rest
}: Props) {
  const base =
    "inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-bold uppercase tracking-wide transition-colors select-none";

  const variants: Record<Variant, string> = {
    primary: disabled
      ? "bg-disabled text-disabled-foreground cursor-not-allowed"
      : "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
    ghost: disabled
      ? "bg-disabled text-disabled-foreground cursor-not-allowed"
      : "bg-disabled text-disabled-foreground hover:bg-disabled/90",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      aria-disabled={disabled}
      className={clsx(base, variants[variant], className)}
      {...rest}
    >
      {children}
    </button>
  );
}
