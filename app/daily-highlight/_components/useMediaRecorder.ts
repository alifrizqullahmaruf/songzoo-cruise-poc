"use client";

import { useCallback, useRef, useState } from "react";

export type RecorderState = "idle" | "recording" | "stopped" | "error";

export function useMediaRecorder() {
  const [state, setState] = useState<RecorderState>("idle");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        setAudioBlob(blob);
        setState("stopped");
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      setState("recording");
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Microphone access denied",
      );
      setState("error");
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }, [state]);

  const reset = useCallback(() => {
    setState("idle");
    setAudioBlob(null);
    setErrorMessage("");
  }, []);

  return { state, audioBlob, errorMessage, startRecording, stopRecording, reset };
}
