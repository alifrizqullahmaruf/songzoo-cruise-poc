"use client";

import { useAppStore } from "@/lib/store";
import { canProceedArtistReference } from "@/lib/validation";
import { StepFooter } from "@/app/song-setup/_components/StepFooter";

export default function SongSetupArtistPage() {
  const songSetup = useAppStore((s) => s.songSetup);
  const setSongSetupField = useAppStore((s) => s.setSongSetupField);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 px-6 pt-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-500">
          Step 2 of 7
        </p>
        <h3 className="mb-6 text-lg font-bold">Who should inspire the style?</h3>
        <input
          type="text"
          value={songSetup.artistReference}
          onChange={(e) => setSongSetupField("artistReference", e.target.value)}
          placeholder="e.g. Ed Sheeran, Taylor Swift"
          className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm outline-none focus:border-primary"
          maxLength={80}
        />
        <p className="mt-2 text-xs text-gray-400">
          Name an artist whose style you&apos;d like the song to reflect.
        </p>
      </div>
      <StepFooter
        backHref="/song-setup/title"
        nextHref="/song-setup/humour"
        canProceed={canProceedArtistReference(songSetup)}
      />
    </div>
  );
}
