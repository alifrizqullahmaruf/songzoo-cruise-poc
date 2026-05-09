"use client";

import Link from "next/link";
import clsx from "clsx";
import { useAppStore } from "@/lib/store";

type MenuItemProps = {
  label: string;
  sublabel: string;
  href: string;
  active: boolean;
  stepNumber: number;
};

function MenuItem({ label, sublabel, href, active, stepNumber }: MenuItemProps) {
  const inner = (
    <div
      className={clsx(
        "flex items-center gap-4 rounded-xl border-2 px-5 py-4 transition-colors",
        active
          ? "border-primary bg-primary text-white"
          : "border-gray-200 bg-gray-100 text-gray-400",
      )}
    >
      <div
        className={clsx(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold",
          active ? "bg-white/20 text-white" : "bg-gray-200 text-gray-400",
        )}
      >
        {stepNumber}
      </div>
      <div className="flex-1 text-left">
        <p
          className={clsx(
            "text-sm font-bold uppercase tracking-wide",
            active ? "text-white" : "text-gray-400",
          )}
        >
          {label}
        </p>
        <p className={clsx("text-xs", active ? "text-white/80" : "text-gray-400")}>
          {sublabel}
        </p>
      </div>
      {active && (
        <svg
          className="h-5 w-5 shrink-0 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      )}
    </div>
  );

  if (!active) {
    return <div className="cursor-not-allowed opacity-70">{inner}</div>;
  }

  return <Link href={href}>{inner}</Link>;
}

export default function HomePage() {
  const { songSetupCompleted, dailyHighlightCompleted, emailSent } =
    useAppStore((s) => s.appProgress);

  return (
    <div className="flex flex-1 flex-col px-6 pt-8">
      <h2 className="mb-2 text-xl font-bold">Welcome aboard!</h2>
      <p className="mb-8 text-sm text-gray-500">
        Complete each step to get your personalised song.
      </p>

      <div className="flex flex-col gap-4">
        <MenuItem
          stepNumber={1}
          label="Song Setup"
          sublabel="Tell us about your perfect song"
          href="/song-setup/title"
          active={!songSetupCompleted}
        />
        <MenuItem
          stepNumber={2}
          label="Daily Highlights"
          sublabel="Record a moment from each day"
          href="/daily-highlight"
          active={songSetupCompleted && !dailyHighlightCompleted}
        />
        <MenuItem
          stepNumber={3}
          label="My Song"
          sublabel="Your personalised song is ready"
          href="/completed"
          active={dailyHighlightCompleted && !emailSent}
        />
        <MenuItem
          stepNumber={4}
          label="Take the Survey"
          sublabel="Share your cruise experience"
          href="/survey/rating"
          active={emailSent}
        />
      </div>
    </div>
  );
}
