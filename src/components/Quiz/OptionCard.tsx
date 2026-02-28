"use client";

import type { QuizOption, GestureDirection } from "@/lib/types";
import type { CSSProperties } from "react";

interface OptionCardProps {
  option: QuizOption;
  isSelected: boolean;
  isCorrect: boolean | null; // null = not answered yet
  showResult: boolean;
}

const DIRECTION_STYLES: Record<
  GestureDirection,
  { position: string; arrow: string; animClass: string }
> = {
  up: {
    position: "top-[16%] left-1/2 -translate-x-1/2",
    arrow: "\u2191",
    animClass: "animate-slide-in-down",
  },
  down: {
    position: "bottom-[16%] left-1/2 -translate-x-1/2",
    arrow: "\u2193",
    animClass: "animate-slide-in-up",
  },
  left: {
    position: "left-[4%] top-1/2 -translate-y-1/2",
    arrow: "\u2190",
    animClass: "animate-slide-in-right",
  },
  right: {
    position: "right-[4%] top-1/2 -translate-y-1/2",
    arrow: "\u2192",
    animClass: "animate-slide-in-left",
  },
};

export function OptionCard({ option, isSelected, isCorrect, showResult }: OptionCardProps) {
  const dirStyle = DIRECTION_STYLES[option.direction];

  // Determine visual state
  let className = "glass";
  let borderColor = "border-[var(--glass-border)]";
  let textColor = "text-[var(--color-foreground)]";
  let pulseClass = "";
  let inlineStyle: CSSProperties | undefined;

  if (showResult) {
    if (option.isCorrect) {
      borderColor = "border-[var(--color-success)]/50";
      textColor = "text-[var(--color-success)]";
      className = "";
      inlineStyle = {
        background: "var(--color-success-dim)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      };
    }
    if (isSelected && !isCorrect) {
      borderColor = "border-[var(--color-error)]/50";
      textColor = "text-[var(--color-error)]";
      pulseClass = "animate-pulse-wrong";
      className = "";
      inlineStyle = {
        background: "var(--color-error-dim)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      };
    }
    if (isSelected && isCorrect) {
      pulseClass = "animate-pulse-correct";
    }
  } else if (isSelected) {
    borderColor = "border-[var(--color-primary)]/50";
    className = "";
    inlineStyle = {
      background: "var(--color-primary-dim)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
    };
  }

  const isHorizontal = option.direction === "left" || option.direction === "right";

  return (
    <div
      className={`
        absolute ${dirStyle.position}
        ${isHorizontal ? "w-44 min-h-20" : "w-56 min-h-16"}
        ${className} ${borderColor} ${textColor}
        border rounded-2xl p-4
        flex items-center justify-center gap-2.5
        transition-all duration-300
        ${dirStyle.animClass} ${pulseClass}
      `}
      style={inlineStyle}
    >
      <span className="text-lg opacity-30 font-light">{dirStyle.arrow}</span>
      <span className="text-sm font-medium text-center leading-snug">
        {option.meaning}
      </span>
    </div>
  );
}
