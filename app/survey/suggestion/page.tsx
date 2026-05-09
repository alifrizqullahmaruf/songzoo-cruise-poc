"use client";

import Link from "next/link";
import { useAppStore } from "@/lib/store";

export default function SurveySuggestionPage() {
  const suggestion = useAppStore((s) => s.survey.suggestion);
  const setSurveyField = useAppStore((s) => s.setSurveyField);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 px-6 pt-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-500">
          Survey — Step 3 of 3
        </p>
        <h2 className="mb-2 text-xl font-bold">Any Suggestions?</h2>
        <p className="mb-6 text-sm text-gray-500">
          Help us make future cruises even better.
        </p>

        <textarea
          value={suggestion}
          onChange={(e) => setSurveyField("suggestion", e.target.value)}
          placeholder="Tell us what we could improve or what you loved most…"
          rows={6}
          className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm outline-none focus:border-primary resize-none"
          maxLength={500}
        />
        <p className="mt-1 text-right text-xs text-gray-400">
          {suggestion.length}/500
        </p>
      </div>

      <div className="flex items-center justify-between px-6 pb-8 pt-6">
        <Link
          href="/survey/amenities"
          className="inline-flex items-center justify-center rounded-md bg-gray-200 px-6 py-3 text-sm font-bold uppercase tracking-wide text-gray-600 hover:bg-gray-300"
        >
          Back
        </Link>
        <Link
          href="/thank-you"
          className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-primary/90"
        >
          Submit
        </Link>
      </div>
    </div>
  );
}
