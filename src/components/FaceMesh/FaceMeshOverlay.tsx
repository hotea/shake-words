"use client";

import { type GestureStatus } from "@/hooks/useGesture";
import type { HeadPose } from "@/lib/types";

interface FaceMeshOverlayProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  status: GestureStatus;
  error: string | null;
  pose: HeadPose | null;
  onRecalibrate: () => void;
}

export function FaceMeshOverlay({
  videoRef,
  status,
  error,
  pose,
  onRecalibrate,
}: FaceMeshOverlayProps) {
  return (
    <div className="relative w-40 h-30 rounded-[var(--radius-lg)] overflow-hidden bg-white border border-[var(--color-border)] shadow-lg">
      {/* Camera feed */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover scale-x-[-1]"
        playsInline
        muted
      />

      {/* Status overlay */}
      {status !== "ready" && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          {status === "loading" && (
            <div className="text-center">
              <div className="w-8 h-8 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span className="text-xs text-[var(--color-muted)] font-medium">Initializing...</span>
            </div>
          )}
          {status === "calibrating" && (
            <div className="text-center px-3">
              <div className="w-7 h-7 border-3 border-[var(--color-warning)] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span className="text-xs text-[var(--color-warning)] font-semibold">
                Look straight
              </span>
            </div>
          )}
          {status === "error" && (
            <div className="text-center px-3">
              <div className="w-9 h-9 rounded-full bg-[var(--color-error-dim)] flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-[var(--color-error)]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </div>
              <span className="text-xs text-[var(--color-error)] font-medium">
                {error || "Camera error"}
              </span>
            </div>
          )}
          {status === "idle" && (
            <span className="text-xs text-[var(--color-muted)] font-medium">Camera off</span>
          )}
        </div>
      )}

      {/* Pose indicator (crosshair showing head direction) */}
      {status === "ready" && pose && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Crosshair center lines */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-[var(--color-primary)]/15" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[var(--color-primary)]/15" />
          {/* Direction dot */}
          <div
            className="absolute w-3 h-3 rounded-full shadow-lg transition-all duration-100"
            style={{
              background: "var(--gradient-primary)",
              boxShadow: "0 0 10px rgba(77, 236, 19, 0.5)",
              left: `${50 + (pose.yaw / 30) * 30}%`,
              top: `${50 - (pose.pitch / 30) * 30}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
      )}

      {/* Recalibrate button */}
      {status === "ready" && (
        <button
          onClick={onRecalibrate}
          className="absolute bottom-2 right-2 text-[10px] px-2.5 py-1 rounded-full bg-white/90 border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:border-[var(--color-primary)]/30 transition-all shadow-sm"
          title="Recalibrate"
        >
          Reset
        </button>
      )}

      {/* Status badge */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/90 border border-[var(--color-border)] shadow-sm">
        <span className={`w-2 h-2 rounded-full ${status === "ready" ? "bg-[var(--color-success)]" : status === "error" ? "bg-[var(--color-error)]" : "bg-[var(--color-warning)] animate-pulse"}`} />
        <span className="text-[10px] font-medium text-[var(--color-muted)] capitalize">{status}</span>
      </div>
    </div>
  );
}
