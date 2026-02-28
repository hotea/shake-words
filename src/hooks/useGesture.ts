"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { GestureEngine, type GestureEngineConfig } from "@/lib/gesture-engine";
import type { GestureDirection, GestureEvent, HeadPose } from "@/lib/types";

export type GestureStatus = "idle" | "loading" | "calibrating" | "ready" | "error";

interface UseGestureOptions {
  enabled?: boolean;
  config?: Partial<GestureEngineConfig>;
  onGesture?: (event: GestureEvent) => void;
}

interface UseGestureReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  status: GestureStatus;
  error: string | null;
  pose: HeadPose | null;
  lastGesture: GestureDirection | null;
  /** Manually recalibrate (look straight at camera) */
  recalibrate: () => void;
}

export function useGesture(options: UseGestureOptions = {}): UseGestureReturn {
  const { enabled = true, config, onGesture } = options;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const engineRef = useRef<GestureEngine | null>(null);
  const onGestureRef = useRef(onGesture);
  onGestureRef.current = onGesture;

  const [status, setStatus] = useState<GestureStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [pose, setPose] = useState<HeadPose | null>(null);
  const [lastGesture, setLastGesture] = useState<GestureDirection | null>(null);

  const recalibrate = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.startCalibration();
      setStatus("calibrating");
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let destroyed = false;
    const engine = new GestureEngine(config);
    engineRef.current = engine;

    engine.setPoseCallback((p) => {
      if (destroyed) return;
      setPose(p);
      if (engine.isCalibrating()) {
        setStatus("calibrating");
      } else {
        setStatus("ready");
      }
    });

    engine.setGestureCallback((event) => {
      if (destroyed) return;
      setLastGesture(event.direction);
      onGestureRef.current?.(event);
      // Clear after animation time
      setTimeout(() => {
        if (!destroyed) setLastGesture(null);
      }, 600);
    });

    async function waitForVideoRef(timeout = 3000): Promise<HTMLVideoElement> {
      const start = Date.now();
      while (Date.now() - start < timeout) {
        if (videoRef.current) return videoRef.current;
        await new Promise((r) => setTimeout(r, 50));
      }
      throw new Error("Camera view not available. Please try refreshing the page.");
    }

    async function start() {
      try {
        setStatus("loading");
        setError(null);

        const video = await waitForVideoRef();
        if (destroyed) return;

        await engine.init(video);
        if (destroyed) return;

        setStatus("calibrating");
        engine.start();
      } catch (err) {
        if (destroyed) return;
        const msg = err instanceof Error ? err.message : "Failed to start gesture engine";
        setError(msg);
        setStatus("error");
      }
    }

    start();

    return () => {
      destroyed = true;
      engine.destroy();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return { videoRef, status, error, pose, lastGesture, recalibrate };
}
