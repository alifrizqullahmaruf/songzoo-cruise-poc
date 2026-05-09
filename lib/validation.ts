import type { SongSetup } from "@/types/app-state";

const isNonEmpty = (s: string) => s.trim().length > 0;

const isValidEmail = (s: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());

export const canProceedSongTitle = (s: SongSetup) => isNonEmpty(s.songTitle);
export const canProceedArtistReference = (s: SongSetup) =>
  isNonEmpty(s.artistReference);
export const canProceedHumourLevel = (s: SongSetup) => s.humourLevel !== null;
export const canProceedProfanityLevel = (s: SongSetup) =>
  s.profanityLevel !== null;
export const canProceedFirstNames = (s: SongSetup) => isNonEmpty(s.firstNames);
export const canProceedEmail = (s: SongSetup) =>
  isValidEmail(s.emailAddress);
export const canProceedBooking = (s: SongSetup) =>
  isNonEmpty(s.bookingId) && s.termsAccepted;
