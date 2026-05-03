"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useGesture } from "@/hooks/useGesture";
import { useQuiz } from "@/hooks/useQuiz";
import { useAudio } from "@/hooks/useAudio";
import { QuizBoard } from "@/components/Quiz/QuizBoard";
import type { GestureDirection, GestureEvent } from "@/lib/types";
import { CET4_BOOK_ID } from "@/data/cet4";
import { loadSettings } from "@/lib/settings";

export default function QuizPage() {
  const [inputMode, setInputMode] = useState<"gesture" | "keyboard">("gesture");
  const [bookId] = useState(CET4_BOOK_ID);

  // Load saved gesture config
  const settings = useMemo(() => loadSettings(), []);
  const gestureConfig = settings.gesture;
  const showCamera = settings.showCamera;

  const quiz = useQuiz({ bookId, autoNext: true, autoNextDelay: 1500 });
  const audio = useAudio();
  const prevQuestionWord = useRef<string | null>(null);

  // Auto-pronounce word when question changes
  useEffect(() => {
    if (quiz.question && quiz.state === "ready") {
      const word = quiz.question.word.word;
      if (word !== prevQuestionWord.current) {
        prevQuestionWord.current = word;
        // Small delay to let UI render first
        const timer = setTimeout(() => audio.speak(word), 300);
        return () => clearTimeout(timer);
      }
    }
  }, [quiz.question, quiz.state, audio]);

  // Play sound effects on answer
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
        showCamera={showCamera}
        paused={gesture.paused}
        baselinePose={gesture.baselinePose}
        yawThreshold={gestureConfig.yawThreshold}
        pitchThreshold={gestureConfig.pitchThreshold}
      />
    </main>
  );
}
