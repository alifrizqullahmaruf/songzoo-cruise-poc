"use client";

import Link from "next/link";
import clsx from "clsx";

type Props = {
  backHref: string;
  canProceed: boolean;
} & (
  | { nextHref: string; onDone?: never }
  | { onDone: () => void; nextHref?: never }
);

export function StepFooter({ backHref, canProceed, nextHref, onDone }: Props) {
  const forwardBase =
    "inline-flex items-center justify-center rounded-md px-8 py-3 text-sm font-bold uppercase tracking-wide transition-colors select-none";
  const forwardActive = "bg-primary text-white hover:bg-primary/90 active:bg-primary/80";
  const forwardDisabled = "bg-disabled text-white cursor-not-allowed";

  return (
    <div className="flex items-center justify-between px-6 pb-8 pt-6">
      <Link
        href={backHref}
        className="inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-bold uppercase tracking-wide bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors select-none"
      >
        Back
      </Link>

      {nextHref ? (
        canProceed ? (
          <Link
            href={nextHref}
            className={clsx(forwardBase, forwardActive)}
          >
            Next
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className={clsx(forwardBase, forwardDisabled)}
          >
            Next
          </span>
        )
      ) : (
        <button
          type="button"
          onClick={canProceed ? onDone : undefined}
          disabled={!canProceed}
          className={clsx(forwardBase, canProceed ? forwardActive : forwardDisabled)}
        >
          Done
        </button>
      )}
    </div>
  );
}
