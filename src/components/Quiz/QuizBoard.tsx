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
  showCamera?: boolean;
  paused?: boolean;
  baselinePose?: HeadPose | null;
  yawThreshold?: number;
  pitchThreshold?: number;
  muted?: boolean;
  onToggleMute?: () => void;
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
  showCamera = true,
  paused = false,
  baselinePose = null,
  yawThreshold = 15,
  pitchThreshold = 10,
  muted = false,
  onToggleMute,
}: QuizBoardProps) {
  if (quizState === "loading" && !question) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-background)]">
        <div className="text-center animate-fade-in">
          <div className="w-12 h-12 border-[3px] border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--color-muted)] text-sm">加载题目中...</p>
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
          <p className="text-[var(--color-foreground)] text-lg font-semibold mb-2">无法加载题目</p>
          <p className="text-[var(--color-muted)] text-sm mb-6">请稍后重试</p>
          <Link href="/" className="btn-primary px-6 py-2.5 text-sm">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  const showResult = quizState === "answered";
  const accuracy = sessionCount > 0 ? Math.round((sessionCorrect / sessionCount) * 100) : 0;

  const getOption = (dir: GestureDirection) => question.options.find((o) => o.direction === dir)!;
  const upOption = getOption("up");
  const downOption = getOption("down");
  const leftOption = getOption("left");
  const rightOption = getOption("right");

  return (
    <div className="relative w-full min-h-screen bg-[var(--color-background)] flex flex-col">
      {/* 顶部导航栏 */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 z-20">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center justify-center w-9 h-9 rounded-[var(--radius-md)] bg-white border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:border-[var(--color-primary)]/30 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>

          {/* 统计信息 */}
          <div className="flex items-center gap-3 bg-white rounded-[var(--radius-md)] px-3 py-1.5 border border-[var(--color-border)]">
            <div className="flex items-center gap-1">
              <span className="text-[var(--color-muted)] text-xs">已答</span>
              <span className="text-[var(--color-foreground)] font-semibold text-sm">{sessionCount}</span>
            </div>
            <span className="w-px h-3 bg-[var(--color-border)]" />
            <div className="flex items-center gap-1">
              <span className="text-[var(--color-success)] font-semibold text-sm">{accuracy}%</span>
              <span className="text-[var(--color-muted)] text-xs">正确</span>
            </div>
          </div>
        </div>

        {/* 输入模式切换 + 静音 + 设置 */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMute}
            className="flex items-center gap-2 bg-white rounded-[var(--radius-md)] px-2.5 py-1.5 border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:border-[var(--color-primary)]/30 transition-all"
            title={muted ? "取消静音" : "静音"}
          >
            {muted ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
              </svg>
            )}
          </button>

          <button
            onClick={onToggleInput}
            className="flex items-center gap-2 bg-white rounded-[var(--radius-md)] px-2.5 py-1.5 border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:border-[var(--color-primary)]/30 transition-all"
          >
          {inputMode === "gesture" ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <span className="text-xs font-medium hidden sm:inline">摄像头</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <span className="text-xs font-medium hidden sm:inline">键盘</span>
            </>
          )}
        </button>

        <Link
          href="/settings"
          className="flex items-center justify-center bg-white rounded-[var(--radius-md)] px-2.5 py-1.5 border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:border-[var(--color-primary)]/30 transition-all"
          title="设置"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Link>
        </div>
      </header>

      {/* 主要内容区域 — 四方向布局 */}
      <div className="flex-1 flex items-center justify-center relative px-3 sm:px-4 pb-2 overflow-hidden">
        {/* 背景反馈 */}
        {showResult && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-700"
            style={{
              background: isCorrect
                ? "radial-gradient(circle at 50% 50%, rgba(4, 120, 87, 0.06), transparent 60%)"
                : "radial-gradient(circle at 50% 50%, rgba(190, 18, 60, 0.06), transparent 60%)",
            }}
          />
        )}

        {/* 四方向网格 — 使用 CSS Grid 精确控制 */}
        <div
          className="z-10 w-full max-w-md grid gap-2 sm:gap-2.5"
          style={{
            gridTemplateColumns: "1fr auto 1fr",
            gridTemplateRows: "auto auto auto",
            justifyItems: "center",
            alignItems: "center",
          }}
        >
          {/* 上选项 — 跨三列 */}
          <div className="col-start-1 col-end-4 w-full max-w-[260px] sm:max-w-[300px]">
            <OptionCard
              option={upOption}
              isSelected={selectedDirection === "up"}
              isCorrect={isCorrect}
              showResult={showResult}
            />
          </div>

          {/* 左选项 */}
          <div className="col-start-1 row-start-2 w-full max-w-[120px] sm:max-w-[140px] justify-self-end">
            <OptionCard
              option={leftOption}
              isSelected={selectedDirection === "left"}
              isCorrect={isCorrect}
              showResult={showResult}
            />
          </div>

          {/* 中央：单词卡片 + 摄像头 */}
          <div className="col-start-2 row-start-2 flex flex-col items-center gap-1.5 sm:gap-2 w-[148px] sm:w-[180px]">
            {/* 单词卡片 */}
            <div
              className={`card p-3 sm:p-4 text-center w-full ${showResult ? "" : "animate-fade-in"}`}
              key={question.word.word}
            >
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-foreground)] tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                {question.word.word}
              </h1>
              <p className="text-[var(--color-muted)] text-xs sm:text-sm mt-0.5">{question.word.phonetic}</p>
            </div>

            {/* 摄像头 — 适配容器宽度 */}
            {inputMode === "gesture" && (
              <div className="w-full">
                <FaceMeshOverlay
                  videoRef={videoRef}
                  status={gestureStatus}
                  error={gestureError}
                  pose={pose}
                  onRecalibrate={onRecalibrate}
                  showCamera={showCamera}
                  paused={paused}
                  baselinePose={baselinePose}
                  yawThreshold={yawThreshold}
                  pitchThreshold={pitchThreshold}
                />
              </div>
            )}

            {/* 键盘提示 */}
            {inputMode === "keyboard" && quizState === "ready" && (
              <div className="flex items-center gap-1 text-[var(--color-muted)]">
                <kbd className="px-1.5 py-0.5 bg-white rounded border border-[var(--color-border)] text-[10px] font-mono">W</kbd>
                <kbd className="px-1.5 py-0.5 bg-white rounded border border-[var(--color-border)] text-[10px] font-mono">A</kbd>
                <kbd className="px-1.5 py-0.5 bg-white rounded border border-[var(--color-border)] text-[10px] font-mono">S</kbd>
                <kbd className="px-1.5 py-0.5 bg-white rounded border border-[var(--color-border)] text-[10px] font-mono">D</kbd>
              </div>
            )}
          </div>

          {/* 右选项 */}
          <div className="col-start-3 row-start-2 w-full max-w-[120px] sm:max-w-[140px] justify-self-start">
            <OptionCard
              option={rightOption}
              isSelected={selectedDirection === "right"}
              isCorrect={isCorrect}
              showResult={showResult}
            />
          </div>

          {/* 下选项 — 跨三列 */}
          <div className="col-start-1 col-end-4 row-start-3 w-full max-w-[260px] sm:max-w-[300px]">
            <OptionCard
              option={downOption}
              isSelected={selectedDirection === "down"}
              isCorrect={isCorrect}
              showResult={showResult}
            />
          </div>

          {/* 结果反馈 — 跨三列 */}
          {showResult && (
            <div
              className={`col-start-1 col-end-4 row-start-4 mt-1 text-sm sm:text-base font-bold animate-fade-in flex items-center justify-center gap-2 px-4 py-1.5 rounded-[var(--radius-md)] ${
                isCorrect
                  ? "bg-[var(--color-success-dim)] text-[var(--color-success)]"
                  : "bg-[var(--color-error-dim)] text-[var(--color-error)]"
              }`}
            >
              {isCorrect ? (
                <>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  回答正确！
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  再试一次！
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 底部进度条 */}
      <div className="px-4 sm:px-6 py-3">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between text-xs text-[var(--color-muted)] mb-1.5">
            <span>本轮进度</span>
            <span>{sessionCount} 词</span>
          </div>
          <div className="h-1.5 bg-white rounded-full overflow-hidden border border-[var(--color-border)]">
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
