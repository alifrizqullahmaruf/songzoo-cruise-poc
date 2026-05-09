"use client";

import { useAppStore } from "@/lib/store";
import { canProceedProfanityLevel } from "@/lib/validation";
import { OptionCard } from "@/app/song-setup/_components/OptionCard";
import { StepFooter } from "@/app/song-setup/_components/StepFooter";
import type { ProfanityLevel } from "@/types/app-state";

const OPTIONS: ProfanityLevel[] = [
  "No profanities",
  "Some profanities",
  "Lots of profanities",
];

export default function SongSetupProfanityPage() {
  const songSetup = useAppStore((s) => s.songSetup);
  const setSongSetupField = useAppStore((s) => s.setSongSetupField);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 px-6 pt-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-500">
          Step 4 of 7
        </p>
        <h3 className="mb-6 text-lg font-bold">Any profanities?</h3>
        <div className="flex flex-col gap-3">
          {OPTIONS.map((option) => (
            <OptionCard
              key={option}
              label={option}
              selected={songSetup.profanityLevel === option}
              onSelect={() => setSongSetupField("profanityLevel", option)}
            />
          ))}
        </div>
      </div>
      <StepFooter
        backHref="/song-setup/humour"
        nextHref="/song-setup/names"
        canProceed={canProceedProfanityLevel(songSetup)}
      />
    </div>
  );
}
