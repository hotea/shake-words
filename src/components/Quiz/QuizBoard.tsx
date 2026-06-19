"use client";

import type { QuizQuestion, GestureDirection } from "@/lib/types";
import type { QuizState } from "@/hooks/useQuiz";
import type { GestureStatus } from "@/hooks/useGesture";
import { OptionCard } from "./OptionCard";
import { FaceMeshOverlay } from "@/components/FaceMesh/FaceMeshOverlay";
import type { HeadPose } from "@/lib/types";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { OnlineCounter } from "@/components/OnlineCounter";

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
  onSpeakWord?: (word: string) => void;
}

type FontSize = "small" | "medium" | "large";

const fontSizeConfig = {
  small: {
    word: "text-xl sm:text-2xl md:text-3xl",
    phonetic: "text-xs sm:text-sm md:text-base",
    option: "text-xs sm:text-sm md:text-base",
    arrow: "text-sm sm:text-base md:text-lg",
    button: "w-8 h-8",
    buttonIcon: "w-4 h-4",
  },
  medium: {
    word: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl",
    phonetic: "text-sm sm:text-base md:text-lg lg:text-xl",
    option: "text-sm sm:text-base md:text-lg lg:text-xl",
    arrow: "text-base sm:text-lg md:text-xl lg:text-2xl",
    button: "w-10 h-10",
    buttonIcon: "w-5 h-5",
  },
  large: {
    word: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
    phonetic: "text-base sm:text-lg md:text-xl lg:text-2xl",
    option: "text-base sm:text-lg md:text-xl lg:text-2xl",
    arrow: "text-lg sm:text-xl md:text-2xl lg:text-3xl",
    button: "w-12 h-12",
    buttonIcon: "w-6 h-6",
  },
};

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
  onSpeakWord,
}: QuizBoardProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>("medium");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      try {
        await containerRef.current.requestFullscreen();
      } catch (err) {
        console.error("Error attempting to enable fullscreen:", err);
      }
    } else {
      try {
        await document.exitFullscreen();
      } catch (err) {
        console.error("Error attempting to exit fullscreen:", err);
      }
    }
  };

  const cycleFontSize = () => {
    const order: FontSize[] = ["small", "medium", "large"];
    const currentIndex = order.indexOf(fontSize);
    const nextIndex = (currentIndex + 1) % order.length;
    setFontSize(order[nextIndex]);
  };

  const fs = fontSizeConfig[fontSize];

  // ---- Loading / Error States ----
  if (quizState === "loading" && !question) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ background: "var(--color-background)" }}
      >
        <div className="text-center animate-fade-in">
          <div
            className="w-12 h-12 border-[3px] rounded-full animate-spin mx-auto mb-4"
            style={{
              borderColor: "var(--color-cinnabar-dim)",
              borderTopColor: "var(--color-cinnabar)",
            }}
          />
          <p
            className="text-sm"
            style={{
              color: "var(--color-muted)",
              fontFamily: "var(--font-display)",
              letterSpacing: "0.1em",
            }}
          >
            加载题目中...
          </p>
        </div>
      </div>
    );
  }

  if (quizState === "error" || !question) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ background: "var(--color-background)" }}
      >
        <div
          className="text-center animate-fade-in max-w-sm card"
          style={{
            padding: "2rem",
          }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{
              background: "var(--color-cinnabar-dim)",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            <svg
              className="w-7 h-7"
              style={{ color: "var(--color-cinnabar)" }}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <p
            className="text-lg mb-2"
            style={{
              color: "var(--color-rice)",
              fontFamily: "var(--font-brand)",
              letterSpacing: "0.1em",
            }}
          >
            无法加载题目
          </p>
          <p
            className="text-sm mb-6"
            style={{
              color: "var(--color-muted)",
              fontFamily: "var(--font-display)",
            }}
          >
            请稍后重试
          </p>
          <Link
            href="/"
            className="btn-primary"
            style={{
              fontFamily: "var(--font-brand)",
              letterSpacing: "0.15em",
            }}
          >
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  const showResult = quizState === "answered";
  const accuracy = sessionCount > 0
    ? Math.round((sessionCorrect / sessionCount) * 100)
    : 0;

  const getOption = (dir: GestureDirection) =>
    question.options.find((o) => o.direction === dir)!;
  const upOption = getOption("up");
  const downOption = getOption("down");
  const leftOption = getOption("left");
  const rightOption = getOption("right");

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col"
      style={{ background: "var(--color-background)" }}
    >
      {/* 顶部导航栏 */}
      <header
        className="flex items-center justify-between px-4 sm:px-6 py-3 z-20"
        style={{
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center justify-center w-9 h-9 rounded-lg transition-all hover:scale-105"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              color: "var(--color-gold)",
            }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </Link>

          {/* 统计信息 */}
          <div
            className="flex items-center gap-3 px-3 py-1.5 rounded-lg"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div className="flex items-center gap-1">
              <span
                className="text-sm"
                style={{
                  color: "var(--color-muted)",
                  fontFamily: "var(--font-display)",
                }}
              >
                已答
              </span>
              <span
                className="text-base font-semibold"
                style={{
                  color: "var(--color-rice)",
                  fontFamily: "var(--font-brand)",
                }}
              >
                {sessionCount}
              </span>
            </div>
            <span
              className="w-px h-3"
              style={{ background: "rgba(212, 165, 116, 0.2)" }}
            />
            <div className="flex items-center gap-1">
              <span
                className="text-base font-semibold"
                style={{
                  color: "var(--color-gold-bright)",
                  fontFamily: "var(--font-brand)",
                }}
              >
                {accuracy}%
              </span>
              <span
                className="text-sm"
                style={{
                  color: "var(--color-muted)",
                  fontFamily: "var(--font-display)",
                }}
              >
                正确
              </span>
            </div>
          </div>
        </div>

        {/* 输入模式切换 + 字体大小 + 全屏 + 设置 */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleInput}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              color: "var(--color-muted)",
            }}
          >
            {inputMode === "gesture" ? (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m15.75 10.5 4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
                <span
                  className="text-xs hidden sm:inline"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  摄像头
                </span>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
                <span
                  className="text-xs hidden sm:inline"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  键盘
                </span>
              </>
            )}
          </button>

          <button
            onClick={cycleFontSize}
            className="flex items-center justify-center px-2.5 py-1.5 rounded-lg transition-all hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              color: "var(--color-muted)",
            }}
            title={`字体大小: ${
              fontSize === "small" ? "小" : fontSize === "medium" ? "中" : "大"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.272 8.5a18.022 18.022 0 01-3.284-8.5m0 0h-1.668a6.99 6.99 0 00-.433 2.446v2.868c0 .838.145 1.643.413 2.395M9.586 9h1.668a6.99 6.99 0 01.433 2.446v2.868a7 7 0 01-.413 2.395m0 0h.001M21 14h-1m-1 0a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1z"
              />
            </svg>
          </button>

          <button
            onClick={toggleFullscreen}
            className="flex items-center justify-center px-2.5 py-1.5 rounded-lg transition-all hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              color: "var(--color-muted)",
            }}
            title={isFullscreen ? "退出全屏" : "全屏"}
          >
            {isFullscreen ? (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5M15 15l5.25 5.25"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 8V4a2 2 0 012-2h4M16 4h4a2 2 0 012 2v4M4 16v4a2 2 0 002 2h4M20 16v4a2 2 0 01-2 2h-4"
                />
              </svg>
            )}
          </button>

          <Link
            href="/settings"
            className="flex items-center justify-center px-2.5 py-1.5 rounded-lg transition-all hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              color: "var(--color-muted)",
            }}
            title="设置"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </Link>
        </div>
      </header>

      {/* 单词展示区（页面上方） */}
      <div className="px-4 sm:px-6 pt-4 pb-2">
        <div className="max-w-lg mx-auto text-center">
          <div
            key={question.word.word}
            className={`inline-block ${showResult ? "" : "animate-fade-in"}`}
            style={{
              padding: "1rem 1.5rem",
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "10px",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <h1
                className={`${fs.word} font-bold tracking-tight`}
                style={{ fontFamily: "var(--font-brand)", color: "var(--color-rice)" }}
              >
                {question.word.word}
              </h1>
              <button
                onClick={() => onSpeakWord?.(question.word.word)}
                className={`${fs.button} rounded-lg flex items-center justify-center transition-all hover:scale-105`}
                style={{ background: "var(--color-gold-dim)", border: "1px solid var(--color-border)", color: "var(--color-gold-bright)" }}
                title="发音"
              >
                <svg className={`${fs.buttonIcon}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              </button>
            </div>
            <p className={`${fs.phonetic} mt-1 italic`} style={{ color: "var(--color-muted)", fontFamily: "var(--font-en)" }}>
              {question.word.phonetic}
            </p>
          </div>
        </div>
      </div>

      {/* 主要内容区域 — 圆环布局 */}
      <div className="flex-1 flex items-center justify-center relative px-3 sm:px-4 pb-2 overflow-hidden">
        {/* 背景反馈 */}
        {showResult && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-700"
            style={{
              background: isCorrect
                ? "radial-gradient(circle at 50% 50%, var(--color-jade-dim), transparent 60%)"
                : "radial-gradient(circle at 50% 50%, var(--color-cinnabar-dim), transparent 60%)",
            }}
          />
        )}

        {/* 圆环容器 */}
        <div className="z-10 relative w-full max-w-[480px] sm:max-w-[560px] md:max-w-[640px]" style={{ aspectRatio: "1/1" }}>
          {/* 装饰圆环 */}
          <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle, var(--color-gold-dim) 0%, transparent 70%)" }} />
          <div className="absolute rounded-full border border-dashed border-[var(--color-border)] opacity-40"
            style={{ inset: "12%" }} />

          {/* 中心区域：摄像头 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 w-[35%]">
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

            {inputMode === "keyboard" && quizState === "ready" && (
              <div className="flex items-center gap-1 px-3 py-2 rounded-lg" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
                {["W", "A", "S", "D"].map((key) => (
                  <span key={key} className="px-2 py-1 rounded text-xs font-mono"
                    style={{ background: "var(--color-ink-700)", color: "var(--color-gold-bright)", border: "1px solid var(--color-border)", fontFamily: "var(--font-mono)" }}>
                    {key}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 上选项 — 在圆环上 */}
          <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[36%] max-w-[200px] sm:max-w-[240px]">
            <OptionCard option={upOption} isSelected={selectedDirection === "up"} isCorrect={isCorrect} showResult={showResult} fontSize={fontSize} />
          </div>

          {/* 下选项 — 在圆环上 */}
          <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[36%] max-w-[200px] sm:max-w-[240px]">
            <OptionCard option={downOption} isSelected={selectedDirection === "down"} isCorrect={isCorrect} showResult={showResult} fontSize={fontSize} />
          </div>

          {/* 左选项 — 在圆环上 */}
          <div className="absolute left-[2%] top-1/2 -translate-y-1/2 w-[26%] max-w-[160px] sm:max-w-[190px]">
            <OptionCard option={leftOption} isSelected={selectedDirection === "left"} isCorrect={isCorrect} showResult={showResult} fontSize={fontSize} />
          </div>

          {/* 右选项 — 在圆环上 */}
          <div className="absolute right-[2%] top-1/2 -translate-y-1/2 w-[26%] max-w-[160px] sm:max-w-[190px]">
            <OptionCard option={rightOption} isSelected={selectedDirection === "right"} isCorrect={isCorrect} showResult={showResult} fontSize={fontSize} />
          </div>

          {/* 结果反馈 */}
          {showResult && (
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg animate-fade-in"
              style={{
                background: isCorrect ? "var(--color-jade-dim)" : "var(--color-cinnabar-dim)",
                border: `1px solid ${isCorrect ? "var(--color-jade)" : "var(--color-cinnabar)"}`,
              }}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: isCorrect ? "var(--color-jade)" : "var(--color-cinnabar)" }} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                {isCorrect ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                )}
              </svg>
              <span className="text-sm sm:text-base font-bold" style={{ fontFamily: "var(--font-brand)", color: isCorrect ? "var(--color-jade)" : "var(--color-cinnabar)", letterSpacing: "0.15em" }}>
                {isCorrect ? "回答正确" : "再试一次"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 底部进度条 */}
      <div
        className="px-4 sm:px-6 py-3"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        <div className="max-w-md mx-auto">
          <div
            className="flex items-center justify-between text-xs mb-2"
            style={{
              color: "var(--color-muted)",
              fontFamily: "var(--font-display)",
              letterSpacing: "0.1em",
            }}
          >
            <span>本轮进度</span>
            <span>{sessionCount} 词</span>
          </div>
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{
              background: "var(--color-ink-700)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${Math.min((sessionCount % 10) * 10, 100)}%`,
                background:
                  "linear-gradient(90deg, var(--color-cinnabar), var(--color-gold))",
              }}
            />
          </div>
        </div>
      </div>

      {/* 在线人数 */}
      <OnlineCounter />
    </div>
  );
}
