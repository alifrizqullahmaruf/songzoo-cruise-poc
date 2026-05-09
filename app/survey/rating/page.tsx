"use client";

import Link from "next/link";
import { useAppStore } from "@/lib/store";
import type { Survey } from "@/types/app-state";

type SliderField = keyof Pick<
  Survey,
  "recommendationScore" | "cleanlinessScore" | "staffFriendlinessScore"
>;

const SLIDERS: { key: SliderField; label: string }[] = [
  { key: "recommendationScore", label: "How likely are you to recommend this cruise?" },
  { key: "cleanlinessScore", label: "How would you rate the cleanliness?" },
  { key: "staffFriendlinessScore", label: "How friendly was the staff?" },
];

export default function SurveyRatingPage() {
  const survey = useAppStore((s) => s.survey);
  const setSurveyField = useAppStore((s) => s.setSurveyField);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 px-6 pt-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-500">
          Survey — Step 1 of 3
        </p>
        <h2 className="mb-8 text-xl font-bold">Rate Your Experience</h2>

        <div className="flex flex-col gap-8">
          {SLIDERS.map(({ key, label }) => (
            <div key={key}>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700 leading-snug pr-4">
                  {label}
                </p>
                <span className="shrink-0 text-lg font-bold text-primary">
                  {survey[key]}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={survey[key]}
                onChange={(e) =>
                  setSurveyField(key, parseInt(e.target.value, 10))
                }
                className="w-full accent-primary"
              />
              <div className="mt-1 flex justify-between text-xs text-gray-400">
                <span>1</span>
                <span>10</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end px-6 pb-8 pt-6">
        <Link
          href="/survey/amenities"
          className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-primary/90 active:bg-primary/80"
        >
          Next
        </Link>
      </div>
    </div>
  );
}
