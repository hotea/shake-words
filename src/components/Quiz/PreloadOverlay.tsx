"use client";

import { PreloadProgress } from "@/hooks/useGesturePreload";

interface PreloadOverlayProps {
  progress: PreloadProgress;
  error: string | null;
  onRetry: () => void;
}

export function PreloadOverlay({ progress, error, onRetry }: PreloadOverlayProps) {
  const isError = progress.phase === "error";
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-background)]/95 backdrop-blur-sm">
      <div className="card p-8 text-center max-w-sm w-full mx-4 animate-fade-in">
        {isError ? (
          // Error state
          <>
            <div className="w-14 h-14 rounded-full bg-[var(--color-error-dim)] flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-[var(--color-error)]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-2">初始化失败</h3>
            <p className="text-sm text-[var(--color-muted)] mb-6">{error || "无法启动摄像头，请检查权限设置"}</p>
            <button
              onClick={onRetry}
              className="btn-primary px-6 py-2.5 text-sm"
            >
              重试
            </button>
          </>
        ) : (
          // Loading state
          <>
            <div className="relative w-20 h-20 mx-auto mb-6">
              {/* Spinner */}
              <div className="absolute inset-0 rounded-full border-4 border-[var(--color-border)]" />
              <div 
                className="absolute inset-0 rounded-full border-4 border-[var(--color-primary)] border-t-transparent animate-spin"
                style={{ animationDuration: "1s" }}
              />
              
              {/* Progress percentage */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-[var(--color-primary)]">
                  {progress.progress}%
                </span>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-2">
              准备动作识别
            </h3>
            <p className="text-sm text-[var(--color-muted)] mb-6">
              {progress.message}
            </p>
            
            {/* Progress bar */}
            <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-[var(--color-border)]">
              <div
                className="h-full bg-[var(--gradient-primary)] transition-all duration-300 ease-out"
                style={{ width: `${progress.progress}%` }}
              />
            </div>
            
            {/* Phase indicators */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {["loading_wasm", "loading_model", "starting_camera"].map((phase, index) => {
                const phaseOrder = ["loading_wasm", "loading_model", "starting_camera"];
                const currentIndex = phaseOrder.indexOf(progress.phase);
                const isActive = phase === progress.phase;
                const isCompleted = currentIndex > index;
                
                return (
                  <div
                    key={phase}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      isActive 
                        ? "bg-[var(--color-primary)] scale-125" 
                        : isCompleted 
                          ? "bg-[var(--color-success)]" 
                          : "bg-[var(--color-border)]"
                    }`}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
