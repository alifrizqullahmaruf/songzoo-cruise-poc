"use client";

import { useAppStore } from "@/lib/store";
import { canProceedSongTitle } from "@/lib/validation";
import { StepFooter } from "@/app/song-setup/_components/StepFooter";

export default function SongSetupTitlePage() {
  const songSetup = useAppStore((s) => s.songSetup);
  const setSongSetupField = useAppStore((s) => s.setSongSetupField);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 px-6 pt-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-500">
          Step 1 of 7
        </p>
        <h3 className="mb-6 text-lg font-bold">What shall we call your song?</h3>
        <input
          type="text"
          value={songSetup.songTitle}
          onChange={(e) => setSongSetupField("songTitle", e.target.value)}
          placeholder="e.g. Waves of Joy"
          className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm outline-none focus:border-primary"
          maxLength={80}
        />
        <p className="mt-2 text-xs text-gray-400">
          This will be the title of your personalised song.
        </p>
      </div>
      <StepFooter
        backHref="/home"
        nextHref="/song-setup/artist"
        canProceed={canProceedSongTitle(songSetup)}
      />
    </div>
  );
}
