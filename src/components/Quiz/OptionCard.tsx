"use client";

import type { QuizOption, GestureDirection } from "@/lib/types";
import type { CSSProperties } from "react";

interface OptionCardProps {
  option: QuizOption;
  isSelected: boolean;
  isCorrect: boolean | null;
  showResult: boolean;
  fontSize?: "small" | "medium" | "large";
}

const DIRECTION_CONFIG: Record<
  GestureDirection,
  { arrow: string; label: string; animClass: string }
> = {
  up: {
    arrow: "↑",
    label: "上",
    animClass: "animate-slide-in-down",
  },
  down: {
    arrow: "↓",
    label: "下",
    animClass: "animate-slide-in-up",
  },
  left: {
    arrow: "←",
    label: "左",
    animClass: "animate-slide-in-right",
  },
  right: {
    arrow: "→",
    label: "右",
    animClass: "animate-slide-in-left",
  },
};

const fontSizeConfig = {
  small: {
    arrow: "text-sm sm:text-base md:text-lg",
    meaning: "text-xs sm:text-sm md:text-base",
    padding: "py-2 px-2 sm:py-3 sm:px-3",
    indicator: "w-7 h-7 sm:w-8 sm:h-8",
  },
  medium: {
    arrow: "text-base sm:text-lg md:text-xl lg:text-2xl",
    meaning: "text-sm sm:text-base md:text-lg lg:text-xl",
    padding: "py-3 px-3 sm:py-4 sm:px-4",
    indicator: "w-8 h-8 sm:w-9 sm:h-9",
  },
  large: {
    arrow: "text-lg sm:text-xl md:text-2xl lg:text-3xl",
    meaning: "text-base sm:text-lg md:text-xl lg:text-2xl",
    padding: "py-4 px-4 sm:py-5 sm:px-5",
    indicator: "w-9 h-9 sm:w-10 sm:h-10",
  },
};

export function OptionCard({ option, isSelected, isCorrect, showResult, fontSize = "medium" }: OptionCardProps) {
  const config = DIRECTION_CONFIG[option.direction];
  const fs = fontSizeConfig[fontSize];

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
        ${cardClasses}
        ${config.animClass}
        relative
        ${fs.padding}
        h-full
        flex flex-col items-center justify-center gap-1.5 sm:gap-2
      `}
      style={inlineStyle}
    >
      {/* 方向指示器 */}
      <div className={`
        flex items-center justify-center ${fs.indicator} rounded-[var(--radius-sm)] shrink-0
        ${isSelected && !showResult ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-primary-dim)] text-[var(--color-primary-dark)]"}
        ${showResult && option.isCorrect ? "bg-[var(--color-success)] text-white" : ""}
        ${showResult && isSelected && !isCorrect ? "bg-[var(--color-error)] text-white" : ""}
        transition-colors duration-200
      `}>
        <span className={`${fs.arrow} font-bold`}>{config.arrow}</span>
      </div>

      {/* 选项文本 */}
      <div className="text-center min-w-0 w-full">
        <p className={`${fs.meaning} font-medium text-[var(--color-foreground)] leading-snug line-clamp-2`}>
          {option.meaning}
        </p>
      </div>

      {/* 结果图标 */}
      {showResult && option.isCorrect && (
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[var(--color-success)] text-white flex items-center justify-center shadow-md">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
      )}
      {showResult && isSelected && !isCorrect && (
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[var(--color-error)] text-white flex items-center justify-center shadow-md">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      )}
    </div>
  );
}
