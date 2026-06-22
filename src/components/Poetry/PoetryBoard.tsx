"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import type { GestureDirection, HeadPose } from "@/lib/types";
import type { PoetrySlot, PlacedItem, PoetryPhase, PoetryMode } from "@/hooks/usePoetryQuiz";
import type { Poem } from "@/data/poems";
import { FaceMeshOverlay } from "@/components/FaceMesh/FaceMeshOverlay";

interface PoetryBoardProps {
  poem: Poem | null;
  phase: PoetryPhase;
  mode: PoetryMode;
  slots: PoetrySlot[];
  placed: PlacedItem[];
  targetIndex: number;
  selectedDirection: GestureDirection | null;
  lastCorrect: boolean | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  gestureStatus: string;
  gestureError: string | null;
  pose: HeadPose | null;
  onRecalibrate: () => void;
  inputMode: "gesture" | "keyboard";
  onToggleInput: () => void;
  showCamera: boolean;
  paused: boolean;
  baselinePose: HeadPose | null;
  yawThreshold?: number;
  pitchThreshold?: number;
  completedCount: number;
  errorCount: number;
  onSelect: (direction: GestureDirection) => void;
  onNextPoem: () => void;
  onSwitchMode: (mode: PoetryMode) => void;
}

/** 将诗展平为字符列表 */
function flattenChars(poem: Poem): string[] {
  return poem.lines.join("").split("");
}

export function PoetryBoard({
  poem,
  phase,
  mode,
  slots,
  placed,
  targetIndex,
  selectedDirection,
  lastCorrect,
  videoRef,
  gestureStatus,
  gestureError,
  pose,
  onRecalibrate,
  inputMode,
  onToggleInput,
  showCamera,
  paused,
  baselinePose,
  yawThreshold,
  pitchThreshold,
  completedCount,
  errorCount,
  onSelect,
  onNextPoem,
  onSwitchMode,
}: PoetryBoardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showHint, setShowHint] = useState(false);

  // 目标变化或切换新诗时重置提示
  useEffect(() => { setShowHint(false); }, [targetIndex, poem?.id]);

  if (!poem || phase === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: "var(--color-background)" }}>
        <div className="text-center animate-fade-in">
          <div className="w-12 h-12 border-[3px] rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: "var(--color-jade-dim)", borderTopColor: "var(--color-jade)" }} />
          <p className="text-sm" style={{ color: "var(--color-muted)", fontFamily: "var(--font-display)", letterSpacing: "0.1em" }}>
            载入诗词...
          </p>
        </div>
      </div>
    );
  }

  // ====== 完成状态 ======
  if (phase === "complete") {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: "var(--color-background)" }}>
        <div className="text-center max-w-md mx-auto card p-10 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ background: "var(--color-jade-dim)", border: "2px solid var(--color-jade)", boxShadow: "0 0 30px rgba(106, 170, 138, 0.3)" }}>
            <svg className="w-10 h-10" style={{ color: "var(--color-jade)" }} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-2xl mb-1" style={{ fontFamily: "var(--font-brand)", color: "var(--color-rice)", letterSpacing: "0.15em" }}>
            {poem.title}
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--color-muted)", fontFamily: "var(--font-display)" }}>
            {poem.dynasty} · {poem.author}
          </p>
          <div className="mb-8 space-y-1">
            {poem.linesPunctuated.map((line, i) => (
              <p key={i} className="text-lg animate-fade-in-up"
                style={{ fontFamily: "var(--font-brand)", color: "var(--color-rice)", letterSpacing: "0.1em", animationDelay: `${i * 0.1}s`, animationFillMode: "both" }}>
                {line}
              </p>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mb-8 text-sm" style={{ color: "var(--color-muted)" }}>
            <span>完成 <strong style={{ color: "var(--color-jade)" }}>{completedCount}</strong> 首</span>
            <span>失误 <strong style={{ color: "var(--color-cinnabar)" }}>{errorCount}</strong> 次</span>
          </div>
          <div className="flex items-center justify-center gap-4">
            <button onClick={onNextPoem} className="btn-primary">
              <span style={{ fontFamily: "var(--font-brand)", letterSpacing: "0.15em" }}>下一首</span>
            </button>
            <Link href="/" className="btn-secondary">
              <span style={{ fontFamily: "var(--font-brand)", letterSpacing: "0.15em" }}>返回</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ====== 游戏中 ======
  const placedSet = new Set(placed.map((p) => p.index));
  const total = mode === "char" ? flattenChars(poem).length : poem.lines.length;

  // 逐字模式的提示文本
  const targetChar = mode === "char" ? flattenChars(poem)[targetIndex] : null;
  const targetLine = mode === "line" ? poem.lines[targetIndex] : null;

  return (
    <div ref={containerRef} className="relative w-full h-screen flex flex-col overflow-hidden" style={{ background: "var(--color-background)" }}>
      {/* 顶部导航 */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 z-20" style={{ borderBottom: "1px solid var(--color-border)" }}>
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center justify-center w-9 h-9 rounded-lg transition-all hover:scale-105"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-bamboo)" }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
            <span className="text-sm" style={{ fontFamily: "var(--font-brand)", color: "var(--color-rice)", letterSpacing: "0.1em" }}>
              {poem.title}
            </span>
            <span className="text-xs" style={{ color: "var(--color-muted)" }}>{poem.dynasty}·{poem.author}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 模式切换 */}
          <div className="flex items-center rounded-lg overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
            <button
              onClick={() => onSwitchMode("char")}
              className="px-3 py-1.5 text-xs transition-all"
              style={{
                background: mode === "char" ? "var(--color-jade-dim)" : "var(--color-surface)",
                color: mode === "char" ? "var(--color-jade-bright)" : "var(--color-muted)",
                fontFamily: "var(--font-brand)",
                letterSpacing: "0.1em",
              }}
            >
              逐字
            </button>
            <button
              onClick={() => onSwitchMode("line")}
              className="px-3 py-1.5 text-xs transition-all"
              style={{
                background: mode === "line" ? "var(--color-jade-dim)" : "var(--color-surface)",
                color: mode === "line" ? "var(--color-jade-bright)" : "var(--color-muted)",
                fontFamily: "var(--font-brand)",
                letterSpacing: "0.1em",
              }}
            >
              逐句
            </button>
          </div>

          {/* 统计 */}
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-muted)" }}>
            <span><strong style={{ color: "var(--color-jade)" }}>{placed.length}</strong>/{total}</span>
            <span>误 <strong style={{ color: "var(--color-cinnabar)" }}>{errorCount}</strong></span>
          </div>

          {/* 输入模式 */}
          <button onClick={onToggleInput}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all hover:border-[var(--color-bamboo)] hover:text-[var(--color-bamboo)]"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-muted)" }}>
            {inputMode === "gesture" ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-2 gap-2 overflow-hidden min-h-0">
        {/* 诗词展示区 */}
        <div className="w-full max-w-lg rounded-lg p-3 shrink-0"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-md)" }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg" style={{ fontFamily: "var(--font-brand)", color: "var(--color-bamboo-bright)", letterSpacing: "0.15em" }}>{poem.title}</span>
            <span className="text-xs" style={{ color: "var(--color-muted)" }}>{poem.dynasty}·{poem.author}</span>
          </div>

          {mode === "char" ? (
            /* 逐字模式：每行逐字展示 */
            <div className="space-y-1.5">
              {poem.lines.map((line, lineIdx) => {
                // 计算该行字符在展平序列中的起始偏移
                const offset = poem.lines.slice(0, lineIdx).join("").length;
                return (
                  <div key={lineIdx} className="flex flex-wrap gap-0.5">
                    {line.split("").map((char, charIdx) => {
                      const flatIndex = offset + charIdx;
                      const isPlaced = placedSet.has(flatIndex);
                      const isTarget = flatIndex === targetIndex;

                      if (isPlaced) {
                        return (
                          <span key={charIdx} className="text-base animate-fade-in"
                            style={{ fontFamily: "var(--font-brand)", color: "var(--color-rice)", letterSpacing: "0.06em" }}>
                            {char}
                          </span>
                        );
                      }

                      if (isTarget) {
                        return (
                          <span key={charIdx} className="inline-flex items-center justify-center w-[1.2em] h-[1.4em] rounded animate-pulse cursor-pointer"
                            onClick={() => setShowHint(!showHint)}
                            style={{ background: "var(--color-jade-dim)", border: "1px solid var(--color-jade)" }}>
                            <span style={{ color: "var(--color-jade-bright)", fontFamily: "var(--font-brand)" }}>?</span>
                          </span>
                        );
                      }

                      return (
                        <span key={charIdx} className="inline-block w-[1.2em] h-[1.4em] rounded"
                          style={{ background: "var(--color-ink-700)", border: "1px solid var(--color-border)" }} />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ) : (
            /* 逐句模式：每行整体展示 */
            <div className="space-y-1.5">
              {poem.lines.map((line, i) => {
                const isPlaced = placedSet.has(i);
                const isTarget = i === targetIndex;

                if (isPlaced) {
                  return (
                    <p key={i} className="text-base animate-fade-in"
                      style={{ fontFamily: "var(--font-brand)", color: "var(--color-rice)", letterSpacing: "0.08em" }}>
                      {poem.linesPunctuated[i]}
                    </p>
                  );
                }

                if (isTarget) {
                  return (
                    <div key={i} className="flex items-center gap-2 cursor-pointer" onClick={() => setShowHint(!showHint)}>
                      <span className="inline-block w-2 h-2 rounded-full animate-pulse"
                        style={{ background: "var(--color-jade)", boxShadow: "0 0 8px rgba(106, 170, 138, 0.5)" }} />
                      <span className="text-base" style={{ fontFamily: "var(--font-brand)", color: "var(--color-jade-bright)", letterSpacing: "0.08em" }}>
                        ▮{"　".repeat(line.length)}
                      </span>
                    </div>
                  );
                }

                return (
                  <p key={i} className="text-base" style={{ fontFamily: "var(--font-brand)", color: "var(--color-muted-subtle)", letterSpacing: "0.08em" }}>
                    {"＿".repeat(line.length)}
                  </p>
                );
              })}
            </div>
          )}
        </div>

        {/* 提示 — 点击问号后显示 */}
        {showHint && (
          <div className="text-center animate-fade-in" style={{ animationDuration: "0.3s" }}>
            <p className="text-xs mb-1" style={{ color: "var(--color-muted)", letterSpacing: "0.15em" }}>
              {mode === "char" ? `第 ${targetIndex + 1} 字` : `第 ${targetIndex + 1} 句`}
            </p>
            <p className="text-xl" style={{
              fontFamily: "var(--font-brand)", color: "var(--color-jade-bright)",
              letterSpacing: mode === "char" ? "0.2em" : "0.1em",
              textShadow: "0 0 20px rgba(106, 170, 138, 0.3)",
            }}>
              {mode === "char" ? targetChar : targetLine}
            </p>
          </div>
        )}

        {/* 四向选择区 — 圆环布局 */}
        <div className="relative w-full max-w-[480px] sm:max-w-[560px] md:max-w-[640px] flex-1 min-h-0" style={{ aspectRatio: "1/1", maxHeight: "calc(100vh - 260px)" }}>
          {/* 装饰圆环 */}
          <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle, var(--color-bamboo-dim) 0%, transparent 70%)" }} />
          <div className="absolute rounded-full border border-dashed border-[var(--color-border)] opacity-40"
            style={{ inset: "12%" }} />

          {/* 背景反馈 */}
          {selectedDirection && lastCorrect !== null && (
            <div className="absolute inset-0 rounded-full pointer-events-none transition-opacity duration-500"
              style={{
                background: lastCorrect ? "radial-gradient(circle, var(--color-jade-dim), transparent 60%)" : "radial-gradient(circle, var(--color-cinnabar-dim), transparent 60%)",
                opacity: lastCorrect ? 0.8 : 0.6,
              }} />
          )}

          {/* 中心区域：摄像头 + 提示 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 w-[45%]">
            {inputMode === "gesture" ? (
              <div className="w-full max-w-[200px] sm:max-w-[240px]">
                <FaceMeshOverlay
                  videoRef={videoRef}
                  status={gestureStatus as any}
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
            ) : (
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: "var(--color-ink-700)", border: "1px solid var(--color-border)", color: "var(--color-bamboo)", fontFamily: "var(--font-brand)", fontSize: "16px" }}>
                {mode === "char" ? "字" : "句"}
              </div>
            )}

            {/* 键盘提示 */}
            {inputMode === "keyboard" && (
              <div className="flex items-center gap-1 px-3 py-2 rounded-lg"
                style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
                {["W", "A", "S", "D"].map((key) => (
                  <span key={key} className="px-2 py-1 rounded text-xs"
                    style={{ background: "var(--color-ink-700)", color: "var(--color-bamboo-bright)", border: "1px solid var(--color-border)", fontFamily: "var(--font-mono)" }}>
                    {key}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 上方向卡片 — 在圆环上 */}
          {slots.filter(s => s.direction === "up").map((slot) => {
            const isSelected = selectedDirection === "up";
            const isCorrectPick = isSelected && lastCorrect === true;
            const isWrongPick = isSelected && lastCorrect === false;
            const isFlying = slot.flying;
            const isCharMode = mode === "char";

            let borderColor = "var(--color-border)";
            let bgColor = "var(--color-surface)";
            let extraShadow = "";
            if (isFlying || isCorrectPick) { borderColor = "var(--color-jade)"; bgColor = "var(--color-jade-dim)"; extraShadow = "0 0 20px rgba(106, 170, 138, 0.3)"; }
            else if (isWrongPick) { borderColor = "var(--color-cinnabar)"; bgColor = "var(--color-cinnabar-dim)"; extraShadow = "0 0 20px rgba(200, 57, 46, 0.3)"; }

            return (
              <button key="up" onClick={() => !isFlying && onSelect("up")}
                className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[36%] max-w-[200px] sm:max-w-[240px] flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl transition-all duration-300 cursor-pointer"
                style={{
                  background: bgColor,
                  border: `2px solid ${borderColor}`,
                  boxShadow: `var(--shadow-md)${extraShadow ? `, ${extraShadow}` : ""}`,
                  animation: isWrongPick ? "shake 0.4s ease-in-out" : undefined,
                  opacity: isFlying ? 0 : 1,
                  transform: isFlying ? "scale(0.6) translateY(-40px)" : undefined,
                  pointerEvents: isFlying ? "none" : "auto",
                }}>
                <span className="text-xs" style={{ color: "var(--color-bamboo-bright)", fontFamily: "var(--font-brand)", letterSpacing: "0.1em" }}>
                  ↑ 上
                </span>
                <span className={`text-center leading-relaxed ${isCharMode ? "text-3xl sm:text-4xl" : "text-sm sm:text-base"}`}
                  style={{ fontFamily: "var(--font-brand)", color: "var(--color-rice)", letterSpacing: isCharMode ? "0.1em" : "0.06em" }}>
                  {slot.text}
                </span>
              </button>
            );
          })}

          {/* 下方向卡片 — 在圆环上 */}
          {slots.filter(s => s.direction === "down").map((slot) => {
            const isSelected = selectedDirection === "down";
            const isCorrectPick = isSelected && lastCorrect === true;
            const isWrongPick = isSelected && lastCorrect === false;
            const isFlying = slot.flying;
            const isCharMode = mode === "char";

            let borderColor = "var(--color-border)";
            let bgColor = "var(--color-surface)";
            let extraShadow = "";
            if (isFlying || isCorrectPick) { borderColor = "var(--color-jade)"; bgColor = "var(--color-jade-dim)"; extraShadow = "0 0 20px rgba(106, 170, 138, 0.3)"; }
            else if (isWrongPick) { borderColor = "var(--color-cinnabar)"; bgColor = "var(--color-cinnabar-dim)"; extraShadow = "0 0 20px rgba(200, 57, 46, 0.3)"; }

            return (
              <button key="down" onClick={() => !isFlying && onSelect("down")}
                className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[36%] max-w-[200px] sm:max-w-[240px] flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl transition-all duration-300 cursor-pointer"
                style={{
                  background: bgColor,
                  border: `2px solid ${borderColor}`,
                  boxShadow: `var(--shadow-md)${extraShadow ? `, ${extraShadow}` : ""}`,
                  animation: isWrongPick ? "shake 0.4s ease-in-out" : undefined,
                  opacity: isFlying ? 0 : 1,
                  transform: isFlying ? "scale(0.6) translateY(-40px)" : undefined,
                  pointerEvents: isFlying ? "none" : "auto",
                }}>
                <span className="text-xs" style={{ color: "var(--color-bamboo-bright)", fontFamily: "var(--font-brand)", letterSpacing: "0.1em" }}>
                  ↓ 下
                </span>
                <span className={`text-center leading-relaxed ${isCharMode ? "text-3xl sm:text-4xl" : "text-sm sm:text-base"}`}
                  style={{ fontFamily: "var(--font-brand)", color: "var(--color-rice)", letterSpacing: isCharMode ? "0.1em" : "0.06em" }}>
                  {slot.text}
                </span>
              </button>
            );
          })}

          {/* 左方向卡片 — 在圆环上 */}
          {slots.filter(s => s.direction === "left").map((slot) => {
            const isSelected = selectedDirection === "left";
            const isCorrectPick = isSelected && lastCorrect === true;
            const isWrongPick = isSelected && lastCorrect === false;
            const isFlying = slot.flying;
            const isCharMode = mode === "char";

            let borderColor = "var(--color-border)";
            let bgColor = "var(--color-surface)";
            let extraShadow = "";
            if (isFlying || isCorrectPick) { borderColor = "var(--color-jade)"; bgColor = "var(--color-jade-dim)"; extraShadow = "0 0 20px rgba(106, 170, 138, 0.3)"; }
            else if (isWrongPick) { borderColor = "var(--color-cinnabar)"; bgColor = "var(--color-cinnabar-dim)"; extraShadow = "0 0 20px rgba(200, 57, 46, 0.3)"; }

            return (
              <button key="left" onClick={() => !isFlying && onSelect("left")}
                className="absolute left-[2%] top-1/2 -translate-y-1/2 w-[26%] max-w-[160px] sm:max-w-[190px] flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl transition-all duration-300 cursor-pointer"
                style={{
                  background: bgColor,
                  border: `2px solid ${borderColor}`,
                  boxShadow: `var(--shadow-md)${extraShadow ? `, ${extraShadow}` : ""}`,
                  animation: isWrongPick ? "shake 0.4s ease-in-out" : undefined,
                  opacity: isFlying ? 0 : 1,
                  transform: isFlying ? "scale(0.6) translateY(-40px)" : undefined,
                  pointerEvents: isFlying ? "none" : "auto",
                }}>
                <span className="text-xs" style={{ color: "var(--color-bamboo-bright)", fontFamily: "var(--font-brand)", letterSpacing: "0.1em" }}>
                  ← 左
                </span>
                <span className={`text-center leading-relaxed ${isCharMode ? "text-3xl sm:text-4xl" : "text-sm sm:text-base"}`}
                  style={{ fontFamily: "var(--font-brand)", color: "var(--color-rice)", letterSpacing: isCharMode ? "0.1em" : "0.06em" }}>
                  {slot.text}
                </span>
              </button>
            );
          })}

          {/* 右方向卡片 — 在圆环上 */}
          {slots.filter(s => s.direction === "right").map((slot) => {
            const isSelected = selectedDirection === "right";
            const isCorrectPick = isSelected && lastCorrect === true;
            const isWrongPick = isSelected && lastCorrect === false;
            const isFlying = slot.flying;
            const isCharMode = mode === "char";

            let borderColor = "var(--color-border)";
            let bgColor = "var(--color-surface)";
            let extraShadow = "";
            if (isFlying || isCorrectPick) { borderColor = "var(--color-jade)"; bgColor = "var(--color-jade-dim)"; extraShadow = "0 0 20px rgba(106, 170, 138, 0.3)"; }
            else if (isWrongPick) { borderColor = "var(--color-cinnabar)"; bgColor = "var(--color-cinnabar-dim)"; extraShadow = "0 0 20px rgba(200, 57, 46, 0.3)"; }

            return (
              <button key="right" onClick={() => !isFlying && onSelect("right")}
                className="absolute right-[2%] top-1/2 -translate-y-1/2 w-[26%] max-w-[160px] sm:max-w-[190px] flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl transition-all duration-300 cursor-pointer"
                style={{
                  background: bgColor,
                  border: `2px solid ${borderColor}`,
                  boxShadow: `var(--shadow-md)${extraShadow ? `, ${extraShadow}` : ""}`,
                  animation: isWrongPick ? "shake 0.4s ease-in-out" : undefined,
                  opacity: isFlying ? 0 : 1,
                  transform: isFlying ? "scale(0.6) translateY(-40px)" : undefined,
                  pointerEvents: isFlying ? "none" : "auto",
                }}>
                <span className="text-xs" style={{ color: "var(--color-bamboo-bright)", fontFamily: "var(--font-brand)", letterSpacing: "0.1em" }}>
                  → 右
                </span>
                <span className={`text-center leading-relaxed ${isCharMode ? "text-3xl sm:text-4xl" : "text-sm sm:text-base"}`}
                  style={{ fontFamily: "var(--font-brand)", color: "var(--color-rice)", letterSpacing: isCharMode ? "0.1em" : "0.06em" }}>
                  {slot.text}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
