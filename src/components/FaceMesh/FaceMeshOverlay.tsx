"use client";

import { type GestureStatus } from "@/hooks/useGesture";
import type { HeadPose } from "@/lib/types";
import { useEffect, useState } from "react";

interface FaceMeshOverlayProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  status: GestureStatus;
  error: string | null;
  pose: HeadPose | null;
  onRecalibrate: () => void;
  showCamera?: boolean;
  paused?: boolean;
  baselinePose?: HeadPose | null;
  yawThreshold?: number;
  pitchThreshold?: number;
}

export function FaceMeshOverlay({
  videoRef,
  status,
  error,
  pose,
  onRecalibrate,
  showCamera = true,
  paused = false,
  baselinePose = null,
  yawThreshold = 15,
  pitchThreshold = 10,
}: FaceMeshOverlayProps) {
  const mapFactor = 30;
  const [isClient, setIsClient] = useState(false);
  
  // Wait for client hydration before rendering video
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Determine if we're in loading state
  const isLoading = status === "loading" || status === "idle";
  
  return (
    <div className="relative w-full rounded-[var(--radius-lg)] overflow-hidden bg-white border border-[var(--color-border)] shadow-lg" style={{ aspectRatio: "4/3" }}>
      {/* Loading progress overlay - only show during loading */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm z-50">
          <div className="flex flex-col items-center gap-3">
            {/* Circular progress spinner */}
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-3 border-[var(--color-primary)]/20"></div>
              <div 
                className="absolute inset-0 rounded-full border-3 border-transparent border-t-[var(--color-primary)] animate-spin"
                style={{
                  animation: 'spin 1s linear infinite',
                  borderWidth: '3px'
                }}
              ></div>
            </div>
            <span className="text-xs text-[var(--color-muted)] font-medium">
              {status === "idle" ? "准备中..." : "加载中..."}
            </span>
          </div>
        </div>
      )}

      {/* Only render video element on client after hydration */}
      {isClient && (
        <video
          ref={videoRef}
          className={`w-full h-full object-cover scale-x-[-1] ${showCamera ? "" : "absolute inset-0 opacity-0 pointer-events-none"} ${isLoading ? "opacity-0" : ""}`}
          playsInline
          muted
        />
      )}

      {!showCamera && (
        <div className="absolute inset-0 bg-gradient-to-br from-stone-50 to-stone-100">
          {status === "ready" && pose && baselinePose && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-0 right-0 h-px bg-[var(--color-primary)]/15" style={{ top: "50%" }} />
              <div className="absolute top-0 bottom-0 w-px bg-[var(--color-primary)]/15" style={{ left: "50%" }} />
              <div
                className="absolute rounded-md"
                style={{
                  left: `${50 - (yawThreshold / 30) * mapFactor}%`,
                  top: `${50 - (pitchThreshold / 30) * mapFactor}%`,
                  width: `${(yawThreshold / 30) * mapFactor * 2}%`,
                  height: `${(pitchThreshold / 30) * mapFactor * 2}%`,
                  border: "2px solid rgba(30, 58, 95, 0.45)",
                  backgroundColor: "rgba(30, 58, 95, 0.04)",
                }}
              />
              {/* Head outline - fixed at center */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-16 h-20 rounded-[50%] border-2 border-[var(--color-primary)]/40 bg-[var(--color-primary)]/5 relative">
                  <div className="absolute top-7 left-1/2 -translate-x-1/2 flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]/50" />
                    <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]/50" />
                  </div>
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 w-1.5 h-2 bg-[var(--color-primary)]/20 rounded-b-full" />
                </div>
              </div>
              {/* Center dot - moves with pose, independent of head outline */}
              <div
                className="absolute w-3 h-3 rounded-full shadow-lg transition-all duration-100"
                style={{
                  background: "var(--gradient-primary)",
                  boxShadow: "0 0 10px rgba(30, 58, 95, 0.4)",
                  left: `${50 + (pose.yaw / 30) * mapFactor}%`,
                  top: `${50 - (pose.pitch / 30) * mapFactor}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            </div>
          )}
          {(!baselinePose || status !== "ready") && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-20 rounded-[50%] border-2 border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 relative opacity-50">
                <div className="absolute top-7 left-1/2 -translate-x-1/2 flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]/30" />
                  <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]/30" />
                </div>
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-1.5 h-2 bg-[var(--color-primary)]/10 rounded-b-full" />
              </div>
            </div>
          )}
          {status !== "ready" && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-stone-50/80 backdrop-blur-sm">
              {status === "calibrating" && (
                <div className="text-center px-3">
                  <div className="w-7 h-7 border-[3px] border-[var(--color-warning)] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <span className="text-xs text-[var(--color-warning)] font-semibold">请正视前方</span>
                </div>
              )}
              {status === "error" && (
                <div className="text-center px-3">
                  <div className="w-9 h-9 rounded-full bg-[var(--color-error-dim)] flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-[var(--color-error)]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <span className="text-xs text-[var(--color-error)] font-medium">{error || "摄像头错误"}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {showCamera && status !== "ready" && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          {status === "calibrating" && (
            <div className="text-center px-3">
              <div className="w-7 h-7 border-[3px] border-[var(--color-warning)] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span className="text-xs text-[var(--color-warning)] font-semibold">请正视前方</span>
            </div>
          )}
          {status === "error" && (
            <div className="text-center px-3">
              <div className="w-9 h-9 rounded-full bg-[var(--color-error-dim)] flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-[var(--color-error)]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <span className="text-xs text-[var(--color-error)] font-medium">{error || "摄像头错误"}</span>
            </div>
          )}
        </div>
      )}

      {showCamera && status === "ready" && pose && baselinePose && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 right-0 h-px bg-white/20" style={{ top: `${50 - (baselinePose.pitch / 30) * mapFactor}%` }} />
          <div className="absolute top-0 bottom-0 w-px bg-white/20" style={{ left: `${50 + (baselinePose.yaw / 30) * mapFactor}%` }} />
          <div
            className="absolute rounded"
            style={{
              left: `${50 + (baselinePose.yaw / 30) * mapFactor - (yawThreshold / 30) * mapFactor}%`,
              top: `${50 - (baselinePose.pitch / 30) * mapFactor - (pitchThreshold / 30) * mapFactor}%`,
              width: `${(yawThreshold / 30) * mapFactor * 2}%`,
              height: `${(pitchThreshold / 30) * mapFactor * 2}%`,
              border: "2px solid rgba(255, 255, 255, 0.55)",
              backgroundColor: "rgba(255, 255, 255, 0.06)",
            }}
          />
          <div
            className="absolute w-3 h-3 rounded-full shadow-lg transition-all duration-100"
            style={{
              background: "var(--gradient-primary)",
              boxShadow: "0 0 10px rgba(30, 58, 95, 0.4)",
              left: `${50 + (pose.yaw / 30) * mapFactor}%`,
              top: `${50 - (pose.pitch / 30) * mapFactor}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
      )}

      {status === "ready" && (
        <button
          onClick={onRecalibrate}
          className="absolute bottom-2 right-2 text-[10px] px-2.5 py-1.5 rounded-full bg-white/90 border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:border-[var(--color-primary)]/30 transition-all shadow-sm"
          title="重新校准"
        >
          重置
        </button>
      )}

      {paused && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-40">
          <div className="text-center">
            <svg className="w-6 h-6 text-[var(--color-muted)] mx-auto mb-1.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
            </svg>
            <span className="text-xs text-[var(--color-muted)] font-medium">已暂停</span>
          </div>
        </div>
      )}

      <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/90 border border-[var(--color-border)] shadow-sm">
        <span className={`w-2 h-2 rounded-full ${status === "ready" ? "bg-[var(--color-success)]" : status === "error" ? "bg-[var(--color-error)]" : "bg-[var(--color-warning)] animate-pulse"}`} />
        <span className="text-[10px] font-medium text-[var(--color-muted)] capitalize">
          {status === "ready" ? "就绪" : status === "loading" ? "加载中" : status === "calibrating" ? "校准中" : status === "error" ? "错误" : "空闲"}
        </span>
      </div>
    </div>
  );
}
