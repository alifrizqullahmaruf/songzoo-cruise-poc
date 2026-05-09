"use client";

import { useAppStore } from "@/lib/store";
import { canProceedHumourLevel } from "@/lib/validation";
import { OptionCard } from "@/app/song-setup/_components/OptionCard";
import { StepFooter } from "@/app/song-setup/_components/StepFooter";
import type { HumourLevel } from "@/types/app-state";

const OPTIONS: HumourLevel[] = ["Not funny", "Quite funny", "Very funny"];

export default function SongSetupHumourPage() {
  const songSetup = useAppStore((s) => s.songSetup);
  const setSongSetupField = useAppStore((s) => s.setSongSetupField);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 px-6 pt-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-500">
          Step 3 of 7
        </p>
        <h3 className="mb-6 text-lg font-bold">How funny should it be?</h3>
        <div className="flex flex-col gap-3">
          {OPTIONS.map((option) => (
            <OptionCard
              key={option}
              label={option}
              selected={songSetup.humourLevel === option}
              onSelect={() => setSongSetupField("humourLevel", option)}
            />
          ))}
        </div>
      </div>
      <StepFooter
        backHref="/song-setup/artist"
        nextHref="/song-setup/profanity"
        canProceed={canProceedHumourLevel(songSetup)}
      />
    </div>
  );
}
