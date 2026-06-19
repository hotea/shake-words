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

export function OptionCard({
  option,
  isSelected,
  isCorrect,
  showResult,
  fontSize = "medium",
}: OptionCardProps) {
  const config = DIRECTION_CONFIG[option.direction];
  const fs = fontSizeConfig[fontSize];

  // 确定卡片状态样式
  const baseStyle: CSSProperties = {
    background:
      "linear-gradient(135deg, rgba(10, 18, 14, 0.75) 0%, rgba(18, 30, 24, 0.75) 100%)",
    border: "1px solid rgba(106, 170, 138, 0.18)",
    borderRadius: "10px",
    transition: "all 0.3s ease",
  };

  // 选中状态（回答前）
  if (isSelected && !showResult) {
    baseStyle.border = "1.5px solid var(--color-jade)";
    baseStyle.background =
      "linear-gradient(135deg, rgba(106, 170, 138, 0.12) 0%, rgba(184, 164, 114, 0.06) 100%)";
    baseStyle.boxShadow = "0 0 24px rgba(106, 170, 138, 0.2)";
  }

  // 结果显示状态
  if (showResult) {
    if (option.isCorrect) {
      baseStyle.border = "1.5px solid rgba(106, 170, 138, 0.65)";
      baseStyle.background =
        "linear-gradient(135deg, rgba(106, 170, 138, 0.15) 0%, rgba(184, 164, 114, 0.06) 100%)";
      baseStyle.boxShadow = "0 0 24px rgba(106, 170, 138, 0.18)";
    } else if (isSelected && !isCorrect) {
      baseStyle.border = "1.5px solid rgba(200, 57, 46, 0.65)";
      baseStyle.background =
        "linear-gradient(135deg, rgba(200, 57, 46, 0.12) 0%, rgba(10, 18, 14, 0.7) 100%)";
      baseStyle.boxShadow = "0 0 24px rgba(200, 57, 46, 0.2)";
    }
  }

  // 指示器（方向按钮）样式
  const indicatorBase: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
    color: "var(--color-gold-bright)",
    fontFamily: "var(--font-brand)",
    background: "var(--color-gold-dim)",
    border: "1px solid rgba(184, 164, 114, 0.2)",
    transition: "all 0.3s ease",
  };

  if (isSelected && !showResult) {
    indicatorBase.background = "var(--gradient-primary)";
    indicatorBase.color = "var(--color-rice)";
    indicatorBase.border = "1px solid transparent";
  }
  if (showResult && option.isCorrect) {
    indicatorBase.background =
      "linear-gradient(135deg, var(--color-jade) 0%, var(--color-jade-bright) 100%)";
    indicatorBase.color = "var(--color-rice)";
    indicatorBase.border = "1px solid transparent";
  }
  if (showResult && isSelected && !isCorrect) {
    indicatorBase.background = "var(--gradient-primary)";
    indicatorBase.color = "var(--color-rice)";
    indicatorBase.border = "1px solid transparent";
  }

  return (
    <div
      className={`relative ${fs.padding} h-full flex flex-col items-center justify-center gap-2 ${config.animClass}`}
      style={baseStyle}
    >
      {/* 方向指示器 */}
      <div style={indicatorBase} className={fs.indicator}>
        <span className={`${fs.arrow} font-bold`}>{config.arrow}</span>
      </div>

      {/* 选项文本 */}
      <div className="text-center min-w-0 w-full">
        <p
          className={`${fs.meaning} leading-snug line-clamp-2`}
          style={{
            fontFamily: "var(--font-display)",
            color: showResult && !option.isCorrect && !isSelected
              ? "var(--color-muted)"
              : "var(--color-rice)",
            letterSpacing: "0.03em",
          }}
        >
          {option.meaning}
        </p>
      </div>

      {/* 右上角的结果图标（印章） */}
      {showResult && option.isCorrect && (
        <div
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, var(--color-jade) 0%, var(--color-jade-bright) 100%)",
            color: "var(--color-rice)",
            boxShadow: "0 4px 12px rgba(106, 170, 138, 0.35)",
          }}
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
      )}
      {showResult && isSelected && !isCorrect && (
        <div
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
          style={{
            background: "var(--gradient-primary)",
            color: "var(--color-rice)",
            boxShadow: "var(--shadow-glow)",
          }}
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
