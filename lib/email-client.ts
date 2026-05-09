import type { AppState } from "@/types/app-state";

export async function sendDemoEmail(state: AppState): Promise<void> {
  const res = await fetch("/api/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(state),
  });

  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error ?? "Email send failed");
  }
}
