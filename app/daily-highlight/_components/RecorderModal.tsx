"use client";

import { useEffect, useState } from "react";
import { useMediaRecorder } from "./useMediaRecorder";
import { transcribeAudio } from "@/lib/transcribe-client";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onTranscribed: (text: string) => void;
};

export function RecorderModal({ isOpen, onClose, onTranscribed }: Props) {
  const { state, audioBlob, errorMessage, startRecording, stopRecording, reset } =
    useMediaRecorder();
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribeError, setTranscribeError] = useState("");

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  useEffect(() => {
    if (state !== "stopped" || !audioBlob) return;

    let cancelled = false;
    setIsTranscribing(true);
    setTranscribeError("");

    transcribeAudio(audioBlob)
      .then((text) => {
        if (!cancelled) {
          onTranscribed(text);
          onClose();
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setTranscribeError(
            err instanceof Error ? err.message : "Transcription failed",
          );
          setIsTranscribing(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [state, audioBlob, onTranscribed, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
      <div className="w-full max-w-[430px] rounded-t-3xl bg-white px-6 pb-10 pt-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold uppercase tracking-wide">
            Record Your Highlight
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold text-gray-500"
          >
            Cancel
          </button>
        </div>

        <p className="mb-6 text-sm text-gray-500">
          Tell us about your favourite moment from today.
        </p>

        {(state === "idle" || state === "error") && !isTranscribing && (
          <div className="flex flex-col items-center gap-4">
            {state === "error" && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}
            {transcribeError && (
              <p className="text-sm text-red-500">{transcribeError}</p>
            )}
            <button
              type="button"
              onClick={startRecording}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-primary shadow-lg active:scale-95 transition-transform"
            >
              <MicIcon className="h-9 w-9 text-white" />
            </button>
            <p className="text-xs text-gray-400">Tap to start recording</p>
          </div>
        )}

        {state === "recording" && (
          <div className="flex flex-col items-center gap-4">
            <div className="relative flex h-20 w-20 items-center justify-center">
              <span className="absolute h-20 w-20 animate-ping rounded-full bg-accent-red/30" />
              <button
                type="button"
                onClick={stopRecording}
                className="relative flex h-20 w-20 items-center justify-center rounded-full bg-accent-red shadow-lg active:scale-95 transition-transform"
              >
                <StopIcon className="h-7 w-7 text-white" />
              </button>
            </div>
            <p className="text-xs text-gray-400">Recording… tap to stop</p>
          </div>
        )}

        {(state === "stopped" || isTranscribing) && (
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-primary" />
            <p className="text-sm text-gray-500">Transcribing your recording…</p>
          </div>
        )}
      </div>
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

function StopIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}
