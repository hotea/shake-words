"use client";

import type { QuizOption, GestureDirection } from "@/lib/types";

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
    position: "top-[18%] left-1/2 -translate-x-1/2",
    arrow: "\u2191",
    animClass: "animate-slide-in-down",
  },
  down: {
    position: "bottom-[18%] left-1/2 -translate-x-1/2",
    arrow: "\u2193",
    animClass: "animate-slide-in-up",
  },
  left: {
    position: "left-[5%] top-1/2 -translate-y-1/2",
    arrow: "\u2190",
    animClass: "animate-slide-in-right",
  },
  right: {
    position: "right-[5%] top-1/2 -translate-y-1/2",
    arrow: "\u2192",
    animClass: "animate-slide-in-left",
  },
};

export function OptionCard({ option, isSelected, isCorrect, showResult }: OptionCardProps) {
  const style = DIRECTION_STYLES[option.direction];

  let borderColor = "border-[var(--color-border)]";
  let bgColor = "bg-[var(--color-surface)]";
  let textColor = "text-[var(--color-foreground)]";
  let pulseClass = "";

  if (showResult) {
    if (option.isCorrect) {
      borderColor = "border-[var(--color-success)]";
      bgColor = "bg-[var(--color-success)]/10";
      textColor = "text-[var(--color-success)]";
    }
    if (isSelected && !isCorrect) {
      borderColor = "border-[var(--color-error)]";
      bgColor = "bg-[var(--color-error)]/10";
      textColor = "text-[var(--color-error)]";
      pulseClass = "animate-pulse-wrong";
    }
    if (isSelected && isCorrect) {
      pulseClass = "animate-pulse-correct";
    }
  } else if (isSelected) {
    borderColor = "border-[var(--color-primary)]";
    bgColor = "bg-[var(--color-primary)]/10";
  }

  const isHorizontal = option.direction === "left" || option.direction === "right";

  return (
    <div
      className={`
        absolute ${style.position}
        ${isHorizontal ? "w-44 min-h-20" : "w-56 min-h-16"}
        ${bgColor} ${borderColor} ${textColor}
        border-2 rounded-xl p-3
        flex items-center justify-center gap-2
        transition-all duration-200
        ${style.animClass} ${pulseClass}
      `}
    >
      <span className="text-lg opacity-50">{style.arrow}</span>
      <span className="text-sm font-medium text-center leading-tight">
        {option.meaning}
      </span>
    </div>
  );
}
