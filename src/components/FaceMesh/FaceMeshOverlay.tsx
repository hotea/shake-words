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
    <div className="relative w-40 h-30 rounded-xl overflow-hidden border-2 border-[var(--color-border)] bg-black/50">
      {/* Camera feed */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover scale-x-[-1]"
        playsInline
        muted
      />

      {/* Status overlay */}
      {status !== "ready" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          {status === "loading" && (
            <div className="text-center">
              <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-1" />
              <span className="text-xs text-[var(--color-muted)]">Loading...</span>
            </div>
          )}
          {status === "calibrating" && (
            <div className="text-center px-2">
              <div className="w-5 h-5 border-2 border-[var(--color-warning)] border-t-transparent rounded-full animate-spin mx-auto mb-1" />
              <span className="text-xs text-[var(--color-warning)]">
                Please look straight
              </span>
            </div>
          )}
          {status === "error" && (
            <div className="text-center px-2">
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

      {/* Pose indicator (small crosshair showing head direction) */}
      {status === "ready" && pose && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute w-2 h-2 bg-[var(--color-primary)] rounded-full transition-all duration-100"
            style={{
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
          className="absolute bottom-1 right-1 text-[10px] px-1.5 py-0.5 rounded bg-black/50 text-[var(--color-muted)] hover:text-white transition-colors"
          title="Recalibrate"
        >
          Re-cal
        </button>
      )}
    </div>
  );
}
