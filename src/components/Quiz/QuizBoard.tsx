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
  videoRef: React.RefObject<HTMLVideoElement | null>;
  gestureStatus: GestureStatus;
  gestureError: string | null;
  pose: HeadPose | null;
  onRecalibrate: () => void;
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
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-background)]">
        <div className="text-center animate-fade-in">
          <div className="w-12 h-12 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--color-muted)] text-sm">Loading question...</p>
        </div>
      </div>
    );
  }

  if (quizState === "error" || !question) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-background)]">
        <div className="card p-8 text-center animate-fade-in max-w-sm">
          <div className="w-14 h-14 rounded-full bg-[var(--color-error-dim)] flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-[var(--color-error)]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-[var(--color-foreground)] text-lg font-semibold mb-2">Unable to load question</p>
          <p className="text-[var(--color-muted)] text-sm mb-6">Please try again later</p>
          <Link href="/" className="btn-primary px-6 py-2.5 text-sm">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const showResult = quizState === "answered";
  const accuracy = sessionCount > 0 ? Math.round((sessionCorrect / sessionCount) * 100) : 0;

  return (
    <div className="relative w-full min-h-screen bg-[var(--color-background)] flex flex-col">
      {/* 顶部导航栏 */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 z-20">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)] bg-white border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:border-[var(--color-primary)]/30 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
          
          {/* 统计信息 */}
          <div className="flex items-center gap-2 bg-white rounded-[var(--radius-md)] px-4 py-2 border border-[var(--color-border)]">
            <div className="flex items-center gap-1.5">
              <span className="text-[var(--color-muted)] text-sm">Answered</span>
              <span className="text-[var(--color-foreground)] font-semibold">{sessionCount}</span>
            </div>
            <span className="w-px h-4 bg-[var(--color-border)]" />
            <div className="flex items-center gap-1.5">
              <span className="text-[var(--color-success)] font-semibold">{accuracy}%</span>
              <span className="text-[var(--color-muted)] text-sm">correct</span>
            </div>
          </div>
        </div>

        {/* 输入模式切换 */}
        <button
          onClick={onToggleInput}
          className="flex items-center gap-2 bg-white rounded-[var(--radius-md)] px-4 py-2 border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:border-[var(--color-primary)]/30 transition-all"
        >
          {inputMode === "gesture" ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <span className="text-sm font-medium hidden sm:inline">Camera</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <span className="text-sm font-medium hidden sm:inline">Keyboard</span>
            </>
          )}
        </button>
      </header>

      {/* 主要内容区域 */}
      <div className="flex-1 flex items-center justify-center relative px-4">
        {/* 背景装饰 */}
        {showResult && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-700"
            style={{
              background: isCorrect
                ? "radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.08), transparent 60%)"
                : "radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.08), transparent 60%)",
            }}
          />
        )}

        {/* 中央内容：单词 + 摄像头 */}
        <div className="flex flex-col items-center gap-6 z-10">
          {/* 单词卡片 */}
          <div 
            className={`card p-8 sm:p-10 text-center min-w-[280px] sm:min-w-[320px] ${showResult ? "" : "animate-fade-in"}`}
            key={question.word.word}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-[var(--color-foreground)] mb-2 tracking-tight">
              {question.word.word}
            </h1>
            <p className="text-[var(--color-muted)] text-base sm:text-lg">{question.word.phonetic}</p>
          </div>

          {/* 摄像头区域 */}
          {inputMode === "gesture" && (
            <FaceMeshOverlay
              videoRef={videoRef}
              status={gestureStatus}
              error={gestureError}
              pose={pose}
              onRecalibrate={onRecalibrate}
            />
          )}

          {/* 键盘提示 */}
          {inputMode === "keyboard" && quizState === "ready" && (
            <div className="flex items-center gap-4 text-[var(--color-muted)]">
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white rounded-[var(--radius-sm)] border border-[var(--color-border)] text-xs font-mono">↑</kbd>
                <kbd className="px-2 py-1 bg-white rounded-[var(--radius-sm)] border border-[var(--color-border)] text-xs font-mono">↓</kbd>
                <kbd className="px-2 py-1 bg-white rounded-[var(--radius-sm)] border border-[var(--color-border)] text-xs font-mono">←</kbd>
                <kbd className="px-2 py-1 bg-white rounded-[var(--radius-sm)] border border-[var(--color-border)] text-xs font-mono">→</kbd>
              </div>
              <span className="text-sm">or</span>
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white rounded-[var(--radius-sm)] border border-[var(--color-border)] text-xs font-mono">W</kbd>
                <kbd className="px-2 py-1 bg-white rounded-[var(--radius-sm)] border border-[var(--color-border)] text-xs font-mono">A</kbd>
                <kbd className="px-2 py-1 bg-white rounded-[var(--radius-sm)] border border-[var(--color-border)] text-xs font-mono">S</kbd>
                <kbd className="px-2 py-1 bg-white rounded-[var(--radius-sm)] border border-[var(--color-border)] text-xs font-mono">D</kbd>
              </div>
            </div>
          )}

          {/* 结果反馈 */}
          {showResult && (
            <div
              className={`text-xl font-bold animate-fade-in flex items-center gap-2 px-6 py-3 rounded-[var(--radius-md)] ${
                isCorrect 
                  ? "bg-[var(--color-success-dim)] text-[var(--color-success)]" 
                  : "bg-[var(--color-error-dim)] text-[var(--color-error)]"
              }`}
            >
              {isCorrect ? (
                <>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Correct!
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  Try again!
                </>
              )}
            </div>
          )}
        </div>

        {/* 四个方向选项 */}
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

      {/* 底部进度条 */}
      <div className="px-4 sm:px-6 py-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between text-xs text-[var(--color-muted)] mb-2">
            <span>Session Progress</span>
            <span>{sessionCount} words</span>
          </div>
          <div className="h-2 bg-white rounded-full overflow-hidden border border-[var(--color-border)]">
            <div 
              className="h-full bg-[var(--gradient-primary)] transition-all duration-500"
              style={{ width: `${Math.min((sessionCount % 10) * 10, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
