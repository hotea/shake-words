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
    <div className="relative w-44 h-33 rounded-2xl overflow-hidden glass">
      {/* Camera feed */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover scale-x-[-1]"
        playsInline
        muted
      />

      {/* Status overlay */}
      {status !== "ready" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          {status === "loading" && (
            <div className="text-center">
              <div className="w-7 h-7 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span className="text-xs text-[var(--color-muted)]">Initializing...</span>
            </div>
          )}
          {status === "calibrating" && (
            <div className="text-center px-3">
              <div className="w-6 h-6 border-2 border-[var(--color-warning)] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span className="text-xs text-[var(--color-warning)] font-medium">
                Look straight ahead
              </span>
            </div>
          )}
          {status === "error" && (
            <div className="text-center px-3">
              <div className="w-8 h-8 rounded-full bg-[var(--color-error-dim)] flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-[var(--color-error)]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </div>
              <span className="text-xs text-[var(--color-error)]">
                {error || "Camera error"}
              </span>
            </div>
          )}
          {status === "idle" && (
            <span className="text-xs text-[var(--color-muted)]">Camera off</span>
          )}
        </div>
      )}

      {/* Pose indicator (crosshair showing head direction) */}
      {status === "ready" && pose && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Crosshair center lines */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-[var(--color-primary)]/10" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[var(--color-primary)]/10" />
          {/* Direction dot */}
          <div
            className="absolute w-2.5 h-2.5 rounded-full shadow-lg transition-all duration-100"
            style={{
              background: "var(--gradient-primary)",
              boxShadow: "0 0 8px rgba(99, 102, 241, 0.5)",
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
          className="absolute bottom-1.5 right-1.5 text-[10px] px-2 py-0.5 rounded-full glass-subtle text-[var(--color-muted)] hover:text-white transition-colors"
          title="Recalibrate"
        >
          Re-cal
        </button>
      )}
    </div>
  );
}
