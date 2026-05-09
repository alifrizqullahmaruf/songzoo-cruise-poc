"use client";

import { useAppStore } from "@/lib/store";
import { canProceedFirstNames } from "@/lib/validation";
import { StepFooter } from "@/app/song-setup/_components/StepFooter";

export default function SongSetupNamesPage() {
  const songSetup = useAppStore((s) => s.songSetup);
  const setSongSetupField = useAppStore((s) => s.setSongSetupField);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 px-6 pt-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-500">
          Step 5 of 7
        </p>
        <h3 className="mb-6 text-lg font-bold">Who&apos;s going on this cruise?</h3>
        <input
          type="text"
          value={songSetup.firstNames}
          onChange={(e) => setSongSetupField("firstNames", e.target.value)}
          placeholder="e.g. Sarah, James, Lily"
          className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm outline-none focus:border-primary"
          maxLength={120}
        />
        <p className="mt-2 text-xs text-gray-400">
          Enter the first names of everyone in your group, separated by commas.
        </p>
      </div>
      <StepFooter
        backHref="/song-setup/profanity"
        nextHref="/song-setup/email"
        canProceed={canProceedFirstNames(songSetup)}
      />
    </div>
  );
}
