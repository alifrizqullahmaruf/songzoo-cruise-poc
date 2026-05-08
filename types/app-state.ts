export type HumourLevel = "Not funny" | "Quite funny" | "Very funny";

export type ProfanityLevel =
  | "No profanities"
  | "Some profanities"
  | "Lots of profanities";

export type DayKey = "day1" | "day2" | "day3";

export type DailyHighlight = {
  isCompleted: boolean;
  transcript: string;
};

export type SongSetup = {
  songTitle: string;
  artistReference: string;
  humourLevel: HumourLevel | null;
  profanityLevel: ProfanityLevel | null;
  firstNames: string;
  emailAddress: string;
  bookingId: string;
  termsAccepted: boolean;
};

export type Survey = {
  recommendationScore: number;
  cleanlinessScore: number;
  staffFriendlinessScore: number;
  amenitiesUsed: string[];
  suggestion: string;
};

export type AppProgress = {
  songSetupCompleted: boolean;
  notificationSimulated: boolean;
  dailyHighlightCompleted: boolean;
  emailSent: boolean;
};

export type AppState = {
  appProgress: AppProgress;
  songSetup: SongSetup;
  dailyHighlights: Record<DayKey, DailyHighlight>;
  survey: Survey;
};
