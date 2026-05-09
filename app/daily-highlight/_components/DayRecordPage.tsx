"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { RecorderModal } from "./RecorderModal";
import type { DayKey } from "@/types/app-state";

type Props = {
  day: DayKey;
  dayLabel: string;
};

export function DayRecordPage({ day, dayLabel }: Props) {
  const router = useRouter();
  const highlight = useAppStore((s) => s.dailyHighlights[day]);
  const setDayTranscript = useAppStore((s) => s.setDayTranscript);
  const [modalOpen, setModalOpen] = useState(false);

  function handleTranscribed(text: string) {
    setDayTranscript(day, text);
  }

  return (
    <div className="flex flex-1 flex-col px-6 pt-8">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-1 text-sm font-semibold text-primary"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <h2 className="mb-1 text-xl font-bold">{dayLabel}</h2>
      <p className="mb-8 text-sm text-gray-500">
        What was the best moment of your day?
      </p>

      {highlight.isCompleted ? (
        <div className="flex flex-1 flex-col gap-6">
          <div className="rounded-xl border-2 border-green-500 bg-green-50 p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-green-700">
              Recorded
            </p>
            <p className="text-sm leading-relaxed text-gray-700">
              {highlight.transcript}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="self-start rounded-md border-2 border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 hover:border-gray-400"
          >
            Re-record
          </button>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex h-24 w-24 items-center justify-center rounded-full bg-primary shadow-xl active:scale-95 transition-transform"
          >
            <MicIcon className="h-10 w-10 text-white" />
          </button>
          <p className="text-sm text-gray-500">Tap to record your highlight</p>
        </div>
      )}

      <RecorderModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onTranscribed={handleTranscribed}
      />
    </div>
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
