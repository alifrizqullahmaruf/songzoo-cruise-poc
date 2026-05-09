"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";

export default function NotificationsPage() {
  const router = useRouter();
  const setNotificationSimulated = useAppStore(
    (s) => s.setNotificationSimulated,
  );

  function handleAllow() {
    setNotificationSimulated(true);
    router.push("/home");
  }

  function handleDeny() {
    setNotificationSimulated(true);
    router.push("/home");
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <div className="w-full rounded-2xl bg-gray-100 p-5 shadow-lg">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary">
            <span className="text-xs font-bold text-white">SZ</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">SongZoo</p>
            <p className="text-xs text-gray-500">now</p>
          </div>
        </div>

        <p className="mb-1 text-sm font-semibold text-gray-900">
          &ldquo;SongZoo&rdquo; Would Like to Send You Notifications
        </p>
        <p className="text-xs text-gray-500">
          Notifications may include alerts, sounds and icon badges.
        </p>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={handleDeny}
            className="flex-1 rounded-xl border border-gray-300 bg-white py-2 text-sm font-semibold text-gray-700 active:bg-gray-50"
          >
            Don&apos;t Allow
          </button>
          <button
            type="button"
            onClick={handleAllow}
            className="flex-1 rounded-xl bg-primary py-2 text-sm font-semibold text-white active:bg-primary/80"
          >
            Allow
          </button>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-gray-400">
        We&apos;ll notify you when your personalised song is ready.
      </p>
    </div>
  );
}
