"use client";

import type { QuizOption, GestureDirection } from "@/lib/types";
import type { CSSProperties } from "react";

interface OptionCardProps {
  option: QuizOption;
  isSelected: boolean;
  isCorrect: boolean | null;
  showResult: boolean;
}

const DIRECTION_CONFIG: Record<
  GestureDirection,
  { position: string; arrow: string; label: string; animClass: string }
> = {
  up: {
    position: "top-[12%] left-1/2 -translate-x-1/2",
    arrow: "↑",
    label: "UP",
    animClass: "animate-slide-in-down",
  },
  down: {
    position: "bottom-[12%] left-1/2 -translate-x-1/2",
    arrow: "↓",
    label: "DOWN",
    animClass: "animate-slide-in-up",
  },
  left: {
    position: "left-[5%] top-1/2 -translate-y-1/2",
    arrow: "←",
    label: "LEFT",
    animClass: "animate-slide-in-right",
  },
  right: {
    position: "right-[5%] top-1/2 -translate-y-1/2",
    arrow: "→",
    label: "RIGHT",
    animClass: "animate-slide-in-left",
  },
};

export function OptionCard({ option, isSelected, isCorrect, showResult }: OptionCardProps) {
  const config = DIRECTION_CONFIG[option.direction];
  const isHorizontal = option.direction === "left" || option.direction === "right";

  // 确定卡片状态样式
  let cardClasses = "option-card";
  let inlineStyle: CSSProperties | undefined;

  if (showResult) {
    if (option.isCorrect) {
      cardClasses = "option-card correct";
      inlineStyle = {
        background: "var(--color-success-dim)",
        borderColor: "var(--color-success)",
      };
    } else if (isSelected && !isCorrect) {
      cardClasses = "option-card wrong";
      inlineStyle = {
        background: "var(--color-error-dim)",
        borderColor: "var(--color-error)",
      };
    }
  } else if (isSelected) {
    cardClasses = "option-card selected";
  }

  return (
    <div
      className={`
        absolute ${config.position}
        ${isHorizontal ? "w-40 sm:w-48" : "w-56 sm:w-64"}
        ${cardClasses}
        ${config.animClass}
        z-10
      `}
      style={inlineStyle}
    >
      {/* 方向指示器 */}
      <div className={`
        flex items-center justify-center w-8 h-8 rounded-[var(--radius-md)]
        ${isSelected && !showResult ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-primary-dim)] text-[var(--color-primary-dark)]"}
        ${showResult && option.isCorrect ? "bg-[var(--color-success)] text-white" : ""}
        ${showResult && isSelected && !isCorrect ? "bg-[var(--color-error)] text-white" : ""}
        transition-colors duration-200
      `}>
        <span className="text-lg font-bold">{config.arrow}</span>
      </div>

      {/* 选项文本 */}
      <div className="flex-1 text-center">
        <p className="text-sm font-medium text-[var(--color-foreground)] leading-snug">
          {option.meaning}
        </p>
      </div>

      {/* 结果图标 */}
      {showResult && option.isCorrect && (
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[var(--color-success)] text-white flex items-center justify-center shadow-lg">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
      )}
      {showResult && isSelected && !isCorrect && (
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[var(--color-error)] text-white flex items-center justify-center shadow-lg">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      )}
    </div>
  );
}
