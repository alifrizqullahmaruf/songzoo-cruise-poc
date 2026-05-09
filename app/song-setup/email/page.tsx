"use client";

import { useAppStore } from "@/lib/store";
import { canProceedEmail } from "@/lib/validation";
import { StepFooter } from "@/app/song-setup/_components/StepFooter";

export default function SongSetupEmailPage() {
  const songSetup = useAppStore((s) => s.songSetup);
  const setSongSetupField = useAppStore((s) => s.setSongSetupField);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 px-6 pt-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-500">
          Step 6 of 7
        </p>
        <h3 className="mb-6 text-lg font-bold">Where do we send your song?</h3>
        <input
          type="email"
          inputMode="email"
          autoCapitalize="none"
          value={songSetup.emailAddress}
          onChange={(e) => setSongSetupField("emailAddress", e.target.value)}
          placeholder="your@email.com"
          className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm outline-none focus:border-primary"
        />
        <p className="mt-2 text-xs text-gray-400">
          Your finished song will be emailed to this address.
        </p>
      </div>
      <StepFooter
        backHref="/song-setup/names"
        nextHref="/song-setup/booking"
        canProceed={canProceedEmail(songSetup)}
      />
    </div>
  );
}
