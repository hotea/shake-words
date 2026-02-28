"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useGesture } from "@/hooks/useGesture";
import { useQuiz } from "@/hooks/useQuiz";
import { QuizBoard } from "@/components/Quiz/QuizBoard";
import type { GestureDirection, GestureEvent } from "@/lib/types";
import { CET4_BOOK_ID } from "@/data/cet4";
import { loadSettings } from "@/lib/settings";

export default function QuizPage() {
  const [inputMode, setInputMode] = useState<"gesture" | "keyboard">("gesture");
  const [bookId] = useState(CET4_BOOK_ID);

  // Load saved gesture config
  const gestureConfig = useMemo(() => loadSettings().gesture, []);

  const quiz = useQuiz({ bookId, autoNext: true, autoNextDelay: 1500 });

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

  // Keyboard fallback
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
    <main>
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
      />
    </main>
  );
}
