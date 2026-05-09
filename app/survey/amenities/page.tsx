"use client";

import Link from "next/link";
import clsx from "clsx";
import { useAppStore } from "@/lib/store";

const AMENITIES = [
  "Pool & Aquapark",
  "Spa & Wellness",
  "Fine Dining",
  "Live Entertainment",
  "Casino",
  "Fitness Centre",
  "Rock Climbing Wall",
  "Shore Excursions",
  "Kids Club",
  "Bar & Lounge",
];

export default function SurveyAmenitiesPage() {
  const amenitiesUsed = useAppStore((s) => s.survey.amenitiesUsed);
  const setSurveyField = useAppStore((s) => s.setSurveyField);

  function toggle(amenity: string) {
    const next = amenitiesUsed.includes(amenity)
      ? amenitiesUsed.filter((a) => a !== amenity)
      : [...amenitiesUsed, amenity];
    setSurveyField("amenitiesUsed", next);
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 px-6 pt-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-500">
          Survey — Step 2 of 3
        </p>
        <h2 className="mb-2 text-xl font-bold">Amenities Used</h2>
        <p className="mb-6 text-sm text-gray-500">
          Which amenities did you enjoy on this cruise? Select all that apply.
        </p>

        <div className="flex flex-wrap gap-2">
          {AMENITIES.map((amenity) => {
            const selected = amenitiesUsed.includes(amenity);
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => toggle(amenity)}
                className={clsx(
                  "rounded-full border-2 px-4 py-2 text-xs font-semibold transition-colors select-none",
                  selected
                    ? "border-primary bg-primary text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:border-primary/50",
                )}
              >
                {amenity}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between px-6 pb-8 pt-6">
        <Link
          href="/survey/rating"
          className="inline-flex items-center justify-center rounded-md bg-gray-200 px-6 py-3 text-sm font-bold uppercase tracking-wide text-gray-600 hover:bg-gray-300"
        >
          Back
        </Link>
        <Link
          href="/survey/suggestion"
          className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-primary/90"
        >
          Next
        </Link>
      </div>
    </div>
  );
}
