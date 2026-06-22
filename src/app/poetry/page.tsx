"use client";

import { useState, useCallback, useEffect, useRef, Suspense } from "react";
import { useGesture } from "@/hooks/useGesture";
import { usePoetryQuiz } from "@/hooks/usePoetryQuiz";
import { useAudio } from "@/hooks/useAudio";
import { PoetryBoard } from "@/components/Poetry/PoetryBoard";
import { OnlineCounter } from "@/components/OnlineCounter";
import type { GestureDirection, GestureEvent } from "@/lib/types";
import { loadSettings } from "@/lib/settings";

function PoetryContent() {
  const [inputMode, setInputMode] = useState<"gesture" | "keyboard">("gesture");
  const settings = loadSettings();
  const gestureConfig = settings.gesture;
  const showCamera = settings.showCamera;

  const quiz = usePoetryQuiz();
  const audio = useAudio();
  const soundPlayedRef = useRef(false);

  // 音效反馈 — 只在 lastCorrect 首次变为 true/false 时播放
  useEffect(() => {
    if (quiz.lastCorrect === null) {
      soundPlayedRef.current = false;
      return;
    }
    if (soundPlayedRef.current) return;
    soundPlayedRef.current = true;

    if (quiz.lastCorrect === true) {
      audio.playCorrect();
    } else {
      audio.playWrong();
    }
  }, [quiz.lastCorrect, audio]);

  const handleGesture = useCallback(
    (event: GestureEvent) => {
      if (quiz.phase === "playing") {
        quiz.select(event.direction);
      }
    },
    [quiz],
  );

  const gesture = useGesture({
    enabled: inputMode === "gesture",
    config: gestureConfig,
    onGesture: handleGesture,
  });

  // 键盘控制
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
      if (dir && quiz.phase === "playing") {
        e.preventDefault();
        quiz.select(dir);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inputMode, quiz]);

  const toggleInput = useCallback(() => {
    setInputMode((m) => (m === "gesture" ? "keyboard" : "gesture"));
  }, []);

  return (
    <PoetryBoard
      poem={quiz.poem}
      phase={quiz.phase}
      mode={quiz.mode}
      slots={quiz.slots}
      placed={quiz.placed}
      targetIndex={quiz.targetIndex}
      selectedDirection={quiz.selectedDirection}
      lastCorrect={quiz.lastCorrect}
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
      completedCount={quiz.completedCount}
      errorCount={quiz.errorCount}
      onSelect={quiz.select}
      onNextPoem={quiz.nextPoem}
      onSwitchMode={quiz.switchMode}
    />
  );
}

export default function PoetryPage() {
  return (
    <>
      <OnlineCounter />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="w-10 h-10 border-[3px] border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <PoetryContent />
      </Suspense>
    </>
  );
}
