"use client";

import type { QuizQuestion, GestureDirection } from "@/lib/types";
import type { QuizState } from "@/hooks/useQuiz";
import type { GestureStatus } from "@/hooks/useGesture";
import { OptionCard } from "./OptionCard";
import { FaceMeshOverlay } from "@/components/FaceMesh/FaceMeshOverlay";
import type { HeadPose } from "@/lib/types";

interface QuizBoardProps {
  question: QuizQuestion | null;
  quizState: QuizState;
  selectedDirection: GestureDirection | null;
  isCorrect: boolean | null;
  sessionCount: number;
  sessionCorrect: number;
  // Face mesh props
  videoRef: React.RefObject<HTMLVideoElement | null>;
  gestureStatus: GestureStatus;
  gestureError: string | null;
  pose: HeadPose | null;
  onRecalibrate: () => void;
  // Keyboard fallback info
  inputMode: "gesture" | "keyboard";
  onToggleInput: () => void;
}

export function QuizBoard({
  question,
  quizState,
  selectedDirection,
  isCorrect,
  sessionCount,
  sessionCorrect,
  videoRef,
  gestureStatus,
  gestureError,
  pose,
  onRecalibrate,
  inputMode,
  onToggleInput,
}: QuizBoardProps) {
  if (quizState === "loading" && !question) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--color-muted)]">Loading question...</p>
        </div>
      </div>
    );
  }

  if (quizState === "error" || !question) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <p className="text-[var(--color-error)] text-lg mb-2">Unable to load question</p>
          <p className="text-[var(--color-muted)] text-sm">Please try again later</p>
        </div>
      </div>
    );
  }

  const showResult = quizState === "answered";

  return (
    <div className="relative w-full h-dvh mx-auto flex items-center justify-center overflow-hidden">
      {/* Session stats bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-[var(--color-muted)]">
          <span>
            Answered: <strong className="text-[var(--color-foreground)]">{sessionCount}</strong>
          </span>
          <span>
            Correct:{" "}
            <strong className="text-[var(--color-success)]">
              {sessionCount > 0 ? Math.round((sessionCorrect / sessionCount) * 100) : 0}%
            </strong>
          </span>
        </div>
        <button
          onClick={onToggleInput}
          className="text-xs px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:border-[var(--color-primary)] transition-colors"
        >
          {inputMode === "gesture" ? "Switch to Keyboard" : "Switch to Gesture"}
        </button>
      </div>

      {/* Center: Word + Camera */}
      <div className="flex flex-col items-center gap-4 z-10">
        {/* The word */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-wide mb-1">{question.word.word}</h1>
          <p className="text-[var(--color-muted)] text-sm">{question.word.phonetic}</p>
        </div>

        {/* Camera feed */}
        {inputMode === "gesture" && (
          <FaceMeshOverlay
            videoRef={videoRef}
            status={gestureStatus}
            error={gestureError}
            pose={pose}
            onRecalibrate={onRecalibrate}
          />
        )}

        {/* Keyboard hint */}
        {inputMode === "keyboard" && quizState === "ready" && (
          <p className="text-xs text-[var(--color-muted)] mt-2">
            Use arrow keys or W/A/S/D to select
          </p>
        )}

        {/* Result feedback */}
        {showResult && (
          <div
            className={`text-lg font-bold ${
              isCorrect ? "text-[var(--color-success)]" : "text-[var(--color-error)]"
            }`}
          >
            {isCorrect ? "Correct!" : "Wrong!"}
          </div>
        )}
      </div>

      {/* Four directional options */}
      {question.options.map((option) => (
        <OptionCard
          key={option.direction}
          option={option}
          isSelected={selectedDirection === option.direction}
          isCorrect={isCorrect}
          showResult={showResult}
        />
      ))}
    </div>
  );
}
