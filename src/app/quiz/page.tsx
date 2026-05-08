"use client";

import { useState, useCallback, useEffect, useMemo, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useGesture } from "@/hooks/useGesture";
import { useQuiz } from "@/hooks/useQuiz";
import { useAudio } from "@/hooks/useAudio";
import { QuizBoard } from "@/components/Quiz/QuizBoard";
import type { GestureDirection, GestureEvent } from "@/lib/types";
import { CET4_BOOK_ID } from "@/data/cet4";
import { loadSettings, saveSettings } from "@/lib/settings";
import { getAdapter } from "@/lib/adapter";
import { useAuth } from "@/lib/auth";

function QuizContent() {
  const [inputMode, setInputMode] = useState<"gesture" | "keyboard">("gesture");
  const searchParams = useSearchParams();
  const [bookId, setBookId] = useState<string>(CET4_BOOK_ID);

  useEffect(() => {
    async function resolveBookId() {
      const urlBook = searchParams.get("book");
      if (urlBook) {
        setBookId(urlBook);
        return;
      }
      const adapter = await getAdapter();
      const saved = (adapter as any).getSelectedBookId?.();
      if (saved) setBookId(saved);
    }
    resolveBookId();
  }, [searchParams]);

  const settings = useMemo(() => loadSettings(), []);
  const gestureConfig = settings.gesture;
  const showCamera = settings.showCamera;

  const quiz = useQuiz({ bookId, autoNext: true, autoNextDelay: 1500 });
  const audio = useAudio();
  const handleSpeakWord = useCallback((word: string) => {
    audio.speak(word);
  }, [audio]);

  const prevAnsweredState = useRef<boolean>(false);
  useEffect(() => {
    if (quiz.state === "answered" && !prevAnsweredState.current) {
      if (quiz.isCorrect) {
        audio.playCorrect();
      } else {
        audio.playWrong();
      }
    }
    prevAnsweredState.current = quiz.state === "answered";
  }, [quiz.state, quiz.isCorrect, audio]);

  const handleGesture = useCallback(
    (event: GestureEvent) => {
      if (quiz.state === "ready") {
        quiz.answer(event.direction);
      }
    },
    [quiz],
  );

  const gesture = useGesture({
    enabled: inputMode === "gesture",
    config: gestureConfig,
    onGesture: handleGesture,
  });

  useEffect(() => {
    if (inputMode !== "keyboard") return;

    const keyMap: Record<string, GestureDirection> = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
      w: "up",
      W: "up",
      s: "down",
      S: "down",
      a: "left",
      A: "left",
      d: "right",
      D: "right",
    };

    function handleKeyDown(e: KeyboardEvent) {
      const dir = keyMap[e.key];
      if (dir && quiz.state === "ready") {
        e.preventDefault();
        quiz.answer(dir);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inputMode, quiz]);

  const toggleInput = useCallback(() => {
    setInputMode((m) => (m === "gesture" ? "keyboard" : "gesture"));
  }, []);

  return (
    <QuizBoard
      question={quiz.question}
      quizState={quiz.state}
      selectedDirection={quiz.selectedDirection}
      isCorrect={quiz.isCorrect}
      sessionCount={quiz.sessionCount}
      sessionCorrect={quiz.sessionCorrect}
      videoRef={gesture.videoRef}
      gestureStatus={gesture.status}
      gestureError={gesture.error}
      pose={gesture.pose}
      onRecalibrate={gesture.recalibrate}
      inputMode={inputMode}
      onToggleInput={toggleInput}
      showCamera={showCamera}
      paused={gesture.paused}
      baselinePose={gesture.baselinePose}
      yawThreshold={gestureConfig.yawThreshold}
      pitchThreshold={gestureConfig.pitchThreshold}
      onSpeakWord={handleSpeakWord}
    />
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-[3px] border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}
