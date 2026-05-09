"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";

export default function ThankYouPage() {
  const router = useRouter();
  const reset = useAppStore((s) => s.reset);

  function handleOk() {
    reset();
    router.push("/");
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 text-5xl">🎵</div>

      <h2 className="mb-3 text-2xl font-bold">Thank You!</h2>
      <p className="mb-2 text-sm text-gray-600 leading-relaxed">
        Your feedback helps us create better experiences for future cruisers.
      </p>
      <p className="mb-10 text-sm text-gray-500">
        Your personalised SongZoo song is on its way — enjoy the music!
      </p>

      <button
        type="button"
        onClick={handleOk}
        className="w-full rounded-md bg-primary py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-primary/90 active:bg-primary/80"
      >
        Start Again
      </button>
    </div>
  );
}
