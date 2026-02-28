"use client";

import type { QuizQuestion, GestureDirection } from "@/lib/types";
import type { QuizState } from "@/hooks/useQuiz";
import type { GestureStatus } from "@/hooks/useGesture";
import { OptionCard } from "./OptionCard";
import { FaceMeshOverlay } from "@/components/FaceMesh/FaceMeshOverlay";
import type { HeadPose } from "@/lib/types";
import Link from "next/link";

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
      <div className="flex items-center justify-center h-dvh">
        <div className="text-center animate-fade-in">
          <div className="w-12 h-12 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--color-muted)] text-sm">Loading question...</p>
        </div>
      </div>
    );
  }

  if (quizState === "error" || !question) {
    return (
      <div className="flex items-center justify-center h-dvh">
        <div className="text-center animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-[var(--color-error-dim)] flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-[var(--color-error)]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <p className="text-[var(--color-error)] text-lg font-semibold mb-2">Unable to load question</p>
          <p className="text-[var(--color-muted)] text-sm">Please try again later</p>
        </div>
      </div>
    );
  }

  const showResult = quizState === "answered";
  const accuracy = sessionCount > 0 ? Math.round((sessionCorrect / sessionCount) * 100) : 0;

  return (
    <div className="relative w-full h-dvh mx-auto flex items-center justify-center overflow-hidden">
      {/* Background glow that reacts to answers */}
      {showResult && (
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
            isCorrect ? "opacity-100" : "opacity-100"
          }`}
          style={{
            background: isCorrect
              ? "radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.06), transparent 60%)"
              : "radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.06), transparent 60%)",
          }}
        />
      )}

      {/* Top bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="glass-subtle flex items-center justify-center w-8 h-8 rounded-full text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </Link>
          <div className="glass-subtle flex items-center gap-3 rounded-full px-4 py-1.5 text-sm">
            <span className="text-[var(--color-muted)]">
              <span className="text-[var(--color-foreground)] font-semibold">{sessionCount}</span> answered
            </span>
            <span className="w-px h-3.5 bg-[var(--color-border)]" />
            <span className="text-[var(--color-success)] font-semibold">{accuracy}%</span>
          </div>
        </div>
        <button
          onClick={onToggleInput}
          className="glass-subtle flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
        >
          {inputMode === "gesture" ? (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          )}
          {inputMode === "gesture" ? "Keyboard" : "Camera"}
        </button>
      </div>

      {/* Center: Word + Camera */}
      <div className="flex flex-col items-center gap-4 z-10">
        {/* The word */}
        <div className={`text-center ${showResult ? "" : "animate-fade-in"}`} key={question.word.word}>
          <h1 className="text-5xl font-bold tracking-wide mb-1.5">{question.word.word}</h1>
          <p className="text-[var(--color-muted)] text-sm tracking-wide">{question.word.phonetic}</p>
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
          <p className="text-xs text-[var(--color-muted)]/60 mt-2">
            Use arrow keys or W/A/S/D to select
          </p>
        )}

        {/* Result feedback */}
        {showResult && (
          <div
            className={`text-lg font-bold animate-fade-in ${
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
