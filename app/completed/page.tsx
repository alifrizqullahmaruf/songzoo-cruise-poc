"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { sendDemoEmail } from "@/lib/email-client";

export default function CompletedPage() {
  const appState = useAppStore((s) => ({
    appProgress: s.appProgress,
    songSetup: s.songSetup,
    dailyHighlights: s.dailyHighlights,
    survey: s.survey,
  }));
  const setEmailSent = useAppStore((s) => s.setEmailSent);

  const [sendState, setSendState] = useState<"pending" | "sent" | "error">(
    appState.appProgress.emailSent ? "sent" : "pending",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const sentRef = useRef(false);

  useEffect(() => {
    if (appState.appProgress.emailSent || sentRef.current) return;
    sentRef.current = true;

    sendDemoEmail(appState)
      .then(() => {
        setEmailSent(true);
        setSendState("sent");
      })
      .catch((err: unknown) => {
        sentRef.current = false;
        setErrorMessage(err instanceof Error ? err.message : "Email failed");
        setSendState("error");
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { songTitle, firstNames, emailAddress } = appState.songSetup;

  return (
    <div className="flex flex-1 flex-col items-center px-6 pt-10">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500 shadow-lg">
        <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="mb-2 text-center text-2xl font-bold">
        Your Song is Being Made!
      </h2>
      <p className="mb-1 text-center text-sm text-gray-500">
        Get ready to hear{" "}
        <span className="font-semibold text-primary">&ldquo;{songTitle}&rdquo;</span>
      </p>
      <p className="mb-8 text-center text-sm text-gray-500">
        Hi {firstNames || "there"} — your personalised cruise song is on its way!
      </p>

      <div className="mb-8 w-full rounded-xl border-2 border-gray-100 bg-gray-50 p-4">
        {sendState === "pending" && (
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
            <p className="text-sm text-gray-500">Sending your song details to {emailAddress}…</p>
          </div>
        )}
        {sendState === "sent" && (
          <div className="flex items-center gap-3">
            <span className="text-green-500">✓</span>
            <p className="text-sm text-gray-600">
              Song details sent to <span className="font-semibold">{emailAddress}</span>
            </p>
          </div>
        )}
        {sendState === "error" && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-red-500">Could not send email: {errorMessage}</p>
            <button
              type="button"
              onClick={() => {
                sentRef.current = false;
                setSendState("pending");
                setErrorMessage("");
                sendDemoEmail(appState)
                  .then(() => { setEmailSent(true); setSendState("sent"); })
                  .catch((err: unknown) => {
                    sentRef.current = false;
                    setErrorMessage(err instanceof Error ? err.message : "Email failed");
                    setSendState("error");
                  });
              }}
              className="self-start text-sm font-semibold text-primary underline"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      <Link
        href="/survey/rating"
        className="w-full rounded-md bg-primary py-3 text-center text-sm font-bold uppercase tracking-wide text-white hover:bg-primary/90 active:bg-primary/80"
      >
        Take the Survey
      </Link>
    </div>
  );
}
