import type { AppState } from "@/types/app-state";

export function buildDemoEmailHtml(state: AppState): string {
  const { songSetup, dailyHighlights } = state;
  const { songTitle, artistReference, humourLevel, profanityLevel, firstNames } =
    songSetup;

  const dayRows = (["day1", "day2", "day3"] as const)
    .map((key, i) => {
      const { transcript } = dailyHighlights[key];
      return `<tr>
        <td style="padding:8px 0;font-weight:600;color:#3F69B0;white-space:nowrap;vertical-align:top;padding-right:16px;">Day ${i + 1}</td>
        <td style="padding:8px 0;color:#4A4A4A;">${transcript || "—"}</td>
      </tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="font-family:sans-serif;background:#f5f5f5;margin:0;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.1);">
    <div style="background:#3F69B0;padding:24px;text-align:center;">
      <p style="margin:0;color:#fff;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Icon of the Seas</p>
      <h1 style="margin:8px 0 0;color:#fff;font-size:22px;">SongZoo Cruise</h1>
    </div>
    <div style="padding:32px 28px;">
      <h2 style="margin:0 0 4px;color:#4A4A4A;">Your personalised song is being made!</h2>
      <p style="margin:0 0 24px;color:#888;font-size:14px;">Here&apos;s a summary of what we&apos;ve captured.</p>

      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tr>
          <td style="padding:8px 0;font-weight:600;color:#3F69B0;white-space:nowrap;padding-right:16px;vertical-align:top;">Song Title</td>
          <td style="padding:8px 0;color:#4A4A4A;">${songTitle}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-weight:600;color:#3F69B0;white-space:nowrap;padding-right:16px;vertical-align:top;">Artist Style</td>
          <td style="padding:8px 0;color:#4A4A4A;">${artistReference}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-weight:600;color:#3F69B0;white-space:nowrap;padding-right:16px;vertical-align:top;">Humour</td>
          <td style="padding:8px 0;color:#4A4A4A;">${humourLevel}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-weight:600;color:#3F69B0;white-space:nowrap;padding-right:16px;vertical-align:top;">Profanity</td>
          <td style="padding:8px 0;color:#4A4A4A;">${profanityLevel}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-weight:600;color:#3F69B0;white-space:nowrap;padding-right:16px;vertical-align:top;">Guests</td>
          <td style="padding:8px 0;color:#4A4A4A;">${firstNames}</td>
        </tr>
      </table>

      <h3 style="margin:0 0 8px;color:#4A4A4A;font-size:14px;text-transform:uppercase;letter-spacing:1px;">Daily Highlights</h3>
      <table style="width:100%;border-collapse:collapse;">
        ${dayRows}
      </table>

      <div style="margin-top:32px;padding-top:20px;border-top:1px solid #eee;text-align:center;color:#aaa;font-size:12px;">
        <p style="margin:0;">Powered by <strong style="color:#3F69B0;">SongZoo</strong> &bull; Icon of the Seas</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}
