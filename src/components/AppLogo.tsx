"use client";

export function AppLogo({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const sizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
    xl: "w-14 h-14",
  };

  return (
    <div
      className={`${sizes[size]} relative flex items-center justify-center ${className}`}
      style={{
        border: "1.5px solid rgba(106, 170, 138, 0.35)",
        borderRadius: "6px",
        background:
          "linear-gradient(135deg, rgba(106, 170, 138, 0.08) 0%, rgba(184, 164, 114, 0.05) 100%)",
      }}
    >
      {/* 墨字符号：摇头晃脑 */}
      <span
        className="text-[var(--color-bamboo)] font-bold leading-none"
        style={{
          fontFamily: "var(--font-brand)",
          fontSize:
            size === "sm"
              ? "14px"
              : size === "md"
              ? "18px"
              : size === "lg"
              ? "22px"
              : "28px",
        }}
      >
        晃
      </span>

      {/* 朱砂印章角装饰 */}
      <span
        className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full"
        style={{ background: "var(--color-cinnabar)", opacity: 0.9 }}
      />
    </div>
  );
}
