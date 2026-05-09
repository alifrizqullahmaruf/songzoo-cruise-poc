"use client";

import Link from "next/link";
import clsx from "clsx";
import { useAppStore } from "@/lib/store";
import type { DayKey } from "@/types/app-state";

const DAYS: { key: DayKey; label: string; href: string }[] = [
  { key: "day1", label: "Day 1", href: "/daily-highlight/day-1" },
  { key: "day2", label: "Day 2", href: "/daily-highlight/day-2" },
  { key: "day3", label: "Day 3", href: "/daily-highlight/day-3" },
];

export default function DailyHighlightHubPage() {
  const dailyHighlights = useAppStore((s) => s.dailyHighlights);
  const dailyHighlightCompleted = useAppStore(
    (s) => s.appProgress.dailyHighlightCompleted,
  );

  return (
    <div className="flex flex-1 flex-col px-6 pt-8">
      <h2 className="mb-2 text-xl font-bold">Daily Highlights</h2>
      <p className="mb-8 text-sm text-gray-500">
        Record a special moment from each day of your cruise.
      </p>

      <div className="flex flex-col gap-4">
        {DAYS.map(({ key, label, href }) => {
          const { isCompleted, transcript } = dailyHighlights[key];
          return (
            <Link key={key} href={href}>
              <div
                className={clsx(
                  "flex items-center gap-4 rounded-xl border-2 px-5 py-4 transition-colors",
                  isCompleted
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white hover:border-primary/40",
                )}
              >
                <div
                  className={clsx(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                    isCompleted ? "bg-green-500" : "bg-gray-200",
                  )}
                >
                  {isCompleted ? (
                    <CheckIcon className="h-5 w-5 text-white" />
                  ) : (
                    <MicIcon className="h-4 w-4 text-gray-500" />
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p
                    className={clsx(
                      "text-sm font-bold uppercase tracking-wide",
                      isCompleted ? "text-green-700" : "text-gray-700",
                    )}
                  >
                    {label}
                  </p>
                  {isCompleted && transcript ? (
                    <p className="truncate text-xs text-gray-500">{transcript}</p>
                  ) : (
                    <p className="text-xs text-gray-400">Tap to record</p>
                  )}
                </div>
                <svg
                  className={clsx(
                    "h-4 w-4 shrink-0",
                    isCompleted ? "text-green-500" : "text-gray-400",
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>

      {dailyHighlightCompleted && (
        <div className="mt-8">
          <Link
            href="/completed"
            className="block w-full rounded-md bg-primary py-3 text-center text-sm font-bold uppercase tracking-wide text-white hover:bg-primary/90 active:bg-primary/80"
          >
            Get My Song →
          </Link>
        </div>
      )}
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function MicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
    </svg>
  );
}
