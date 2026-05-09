"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { canProceedBooking } from "@/lib/validation";
import { StepFooter } from "@/app/song-setup/_components/StepFooter";

export default function SongSetupBookingPage() {
  const router = useRouter();
  const songSetup = useAppStore((s) => s.songSetup);
  const setSongSetupField = useAppStore((s) => s.setSongSetupField);
  const completeSongSetup = useAppStore((s) => s.completeSongSetup);

  function handleDone() {
    completeSongSetup();
    router.push("/notifications");
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 px-6 pt-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-500">
          Step 7 of 7
        </p>
        <h3 className="mb-6 text-lg font-bold">Almost there!</h3>

        <div className="mb-6">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-600">
            Booking Reference
          </label>
          <input
            type="text"
            value={songSetup.bookingId}
            onChange={(e) => setSongSetupField("bookingId", e.target.value)}
            placeholder="e.g. ICON-12345"
            className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm outline-none focus:border-primary"
            maxLength={30}
          />
          <p className="mt-1 text-xs text-gray-400">
            Find this on your cruise confirmation email.
          </p>
        </div>

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={songSetup.termsAccepted}
            onChange={(e) =>
              setSongSetupField("termsAccepted", e.target.checked)
            }
            className="mt-0.5 h-5 w-5 shrink-0 accent-primary"
          />
          <span className="text-sm text-gray-700 leading-snug">
            I agree to the SongZoo{" "}
            <span className="font-semibold text-primary">Terms &amp; Conditions</span>{" "}
            and consent to my voice recordings being used solely to generate my
            personalised song.
          </span>
        </label>
      </div>

      <StepFooter
        backHref="/song-setup/email"
        onDone={handleDone}
        canProceed={canProceedBooking(songSetup)}
      />
    </div>
  );
}
