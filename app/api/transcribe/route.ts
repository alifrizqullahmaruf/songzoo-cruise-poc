import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  const form = await request.formData();
  const audio = form.get("audio");

  if (!(audio instanceof File)) {
    return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
  }

  try {
    const { text } = await openai.audio.transcriptions.create({
      file: audio,
      model: "whisper-1",
    });
    return NextResponse.json({ transcript: text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Transcription failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
