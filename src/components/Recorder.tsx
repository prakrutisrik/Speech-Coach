"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SpeechAnalysis } from "@/components/Results";
import { Timer } from "@/components/Timer";


const RECORDING_SECONDS = 60;

type RecorderProps = {
  onResults: (results: SpeechAnalysis) => void;
  onLoadingChange: (isLoading: boolean) => void;
  onError: (message: string | null) => void;
  onStartNewPrompt: () => void;
};

export function Recorder({
  onResults,
  onLoadingChange,
  onError,
  onStartNewPrompt
}: RecorderProps) {
  const transcriptRef = useRef("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(RECORDING_SECONDS);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const startedAtRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);

  const uploadTranscript = useCallback(
  async (transcript: string, durationSeconds: number) => {
    onLoadingChange(true);
    onError(null);

    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          transcript,
          duration: durationSeconds
        })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to analyze speech.");
      }

      onResults(payload as SpeechAnalysis);
    } catch (error) {
      onError(
        error instanceof Error
          ? error.message
          : "Unable to analyze speech."
      );
    } finally {
      onLoadingChange(false);
    }
  },
  [onError, onLoadingChange, onResults]
);

  const stopRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recognitionRef.current?.stop();
      recorder.stop();
    }
  }, []);

  const startRecording = async () => {
    onStartNewPrompt();
    onError(null);
    setSecondsRemaining(RECORDING_SECONDS);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

      const SpeechRecognitionAPI =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognitionAPI) {
  throw new Error(
    "Speech Recognition is not supported in this browser. Use Chrome."
  );
}

const recognition = new SpeechRecognitionAPI();

recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "en-US";

transcriptRef.current = "";

recognition.onresult = (event) => {
  let transcript = "";

  for (let i = 0; i < event.results.length; i++) {
    transcript += event.results[i][0].transcript + " ";
  }

  transcriptRef.current = transcript.trim();
};

recognition.onerror = (event) => {
  console.error(event);
};

recognition.start();

recognitionRef.current = recognition;

      streamRef.current = stream;
      chunksRef.current = [];
      startedAtRef.current = Date.now();

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const durationSeconds = Math.max(
          1,
          Math.round((Date.now() - startedAtRef.current) / 1000)
        );
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });

        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setIsRecording(false);

        if (transcriptRef.current.trim()) {
  void uploadTranscript(
    transcriptRef.current,
    durationSeconds
  );
} else {
  onError("No speech was detected.");
}
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      onError(
        error instanceof Error
          ? error.message
          : "Microphone access was blocked or unavailable."
      );
    }
  };

  useEffect(() => {
    if (!isRecording) {
      return;
    }

    const interval = window.setInterval(() => {
      setSecondsRemaining((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          stopRecording();
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRecording, stopRecording]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <section className="rounded-lg border border-ink/10 bg-white/85 p-6 shadow-panel">
      <div className="space-y-6">
        <Timer secondsRemaining={secondsRemaining} totalSeconds={RECORDING_SECONDS} />

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            className="rounded-md bg-sea px-5 py-3 font-semibold text-white transition hover:bg-sea/90 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isRecording}
            onClick={startRecording}
            type="button"
          >
            Start recording
          </button>
          <button
            className="rounded-md bg-coral px-5 py-3 font-semibold text-white transition hover:bg-coral/90 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!isRecording}
            onClick={stopRecording}
            type="button"
          >
            Stop recording
          </button>
        </div>
      </div>
    </section>
  );
}