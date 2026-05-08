"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  AppState,
  DayKey,
  SongSetup,
  Survey,
} from "@/types/app-state";

type Actions = {
  setSongSetupField: <K extends keyof SongSetup>(
    key: K,
    value: SongSetup[K],
  ) => void;
  completeSongSetup: () => void;
  setNotificationSimulated: (value: boolean) => void;
  setDayTranscript: (day: DayKey, transcript: string) => void;
  completeDailyHighlights: () => void;
  setEmailSent: (value: boolean) => void;
  setSurveyField: <K extends keyof Survey>(key: K, value: Survey[K]) => void;
  reset: () => void;
};

const initialState: AppState = {
  appProgress: {
    songSetupCompleted: false,
    notificationSimulated: false,
    dailyHighlightCompleted: false,
    emailSent: false,
  },
  songSetup: {
    songTitle: "",
    artistReference: "",
    humourLevel: null,
    profanityLevel: null,
    firstNames: "",
    emailAddress: "",
    bookingId: "",
    termsAccepted: false,
  },
  dailyHighlights: {
    day1: { isCompleted: false, transcript: "" },
    day2: { isCompleted: false, transcript: "" },
    day3: { isCompleted: false, transcript: "" },
  },
  survey: {
    recommendationScore: 5,
    cleanlinessScore: 5,
    staffFriendlinessScore: 5,
    amenitiesUsed: [],
    suggestion: "",
  },
};

export const useAppStore = create<AppState & Actions>()(
  persist(
    (set) => ({
      ...initialState,

      setSongSetupField: (key, value) =>
        set((state) => ({
          songSetup: { ...state.songSetup, [key]: value },
        })),

      completeSongSetup: () =>
        set((state) => ({
          appProgress: { ...state.appProgress, songSetupCompleted: true },
        })),

      setNotificationSimulated: (value) =>
        set((state) => ({
          appProgress: { ...state.appProgress, notificationSimulated: value },
        })),

      setDayTranscript: (day, transcript) =>
        set((state) => {
          const updated = {
            ...state.dailyHighlights,
            [day]: { isCompleted: true, transcript },
          };
          const allDone =
            updated.day1.isCompleted &&
            updated.day2.isCompleted &&
            updated.day3.isCompleted;
          return {
            dailyHighlights: updated,
            appProgress: {
              ...state.appProgress,
              dailyHighlightCompleted: allDone,
            },
          };
        }),

      completeDailyHighlights: () =>
        set((state) => ({
          appProgress: { ...state.appProgress, dailyHighlightCompleted: true },
        })),

      setEmailSent: (value) =>
        set((state) => ({
          appProgress: { ...state.appProgress, emailSent: value },
        })),

      setSurveyField: (key, value) =>
        set((state) => ({
          survey: { ...state.survey, [key]: value },
        })),

      reset: () => set(() => ({ ...initialState })),
    }),
    {
      name: "songzoo-cruise-poc/v1",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
