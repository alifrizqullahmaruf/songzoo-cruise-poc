import { NextResponse } from "next/server";
import { Resend } from "resend";
import { buildDemoEmailHtml } from "@/lib/email-template";
import type { AppState } from "@/types/app-state";

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  let state: AppState;
  try {
    state = (await request.json()) as AppState;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const from = process.env.DEMO_EMAIL_FROM ?? "SongZoo <noreply@songzoo.demo>";
  const to = process.env.DEMO_EMAIL_TO ?? state.songSetup.emailAddress;
  const subject = `Your SongZoo song "${state.songSetup.songTitle}" is being made!`;

  try {
    await resend.emails.send({
      from,
      to,
      subject,
      html: buildDemoEmailHtml(state),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Email send failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
