export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const ext = audioBlob.type.includes("mp4") ? "m4a" : "webm";
  const file = new File([audioBlob], `recording.${ext}`, {
    type: audioBlob.type,
  });

  const form = new FormData();
  form.append("audio", file);

  const res = await fetch("/api/transcribe", { method: "POST", body: form });
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error ?? "Transcription failed");
  }

  const { transcript } = await res.json();
  return transcript as string;
}
