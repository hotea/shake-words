"use client";

export function AppLogo({ size = "md", className = "" }: { size?: "sm" | "md" | "lg" | "xl", className?: string }) {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-9 h-9",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return (
    <div className={`${sizes[size]} rounded-[var(--radius-md)] bg-[var(--gradient-primary)] flex items-center justify-center shadow-sm ${className}`}>
      <svg className={`${size === "sm" ? "w-3.5 h-3.5" : size === "lg" ? "w-6 h-6" : size === "xl" ? "w-8 h-8" : "w-5 h-5"} text-white`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    </div>
  );
}
