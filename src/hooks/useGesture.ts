"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { GestureEngine, type GestureEngineConfig } from "@/lib/gesture-engine";
import type { GestureDirection, GestureEvent, HeadPose } from "@/lib/types";
import { usePageVisibility } from "./usePageVisibility";

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
  paused: boolean;
  baselinePose: HeadPose | null;
  recalibrate: () => void;
  updateConfig: (partial: Partial<GestureEngineConfig>) => void;
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
  const [baselinePose, setBaselinePose] = useState<HeadPose | null>(null);

  const isPageVisible = usePageVisibility();
  const [paused, setPaused] = useState(false);

  const recalibrate = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.startCalibration();
      setStatus("calibrating");
    }
  }, []);

  const updateConfig = useCallback((partial: Partial<GestureEngineConfig>) => {
    if (engineRef.current) {
      engineRef.current.updateConfig(partial);
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let destroyed = false;
    const engine = new GestureEngine(config);
    engineRef.current = engine;

    engine.setPoseCallback((p) => {
      if (destroyed) return;
      setPose(p);
      setBaselinePose(engine.getBaselinePose());
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
      setTimeout(() => {
        if (!destroyed) setLastGesture(null);
      }, 600);
    });

    async function waitAndStart() {
      // Wait for video element to be mounted
      let attempts = 0;
      while (!videoRef.current && attempts < 100) {
        await new Promise(resolve => setTimeout(resolve, 50));
        attempts++;
      }
      
      if (destroyed) return;
      
      if (!videoRef.current) {
        setError("Video element not found");
        setStatus("error");
        return;
      }

      try {
        setStatus("loading");
        setError(null);

        await engine.init(videoRef.current);
        
        if (destroyed) return;

        setStatus("calibrating");
        engine.start();
      } catch (err) {
        if (destroyed) return;
        let msg: string;
        if (err instanceof Error) {
          msg = err.message;
        } else if (typeof err === "string") {
          msg = err;
        } else {
          msg = "Failed to start gesture engine";
        }
        console.error("[useGesture] init failed:", err);
        setError(msg);
        setStatus("error");
      }
    }

    waitAndStart();

    return () => {
      destroyed = true;
      engine.destroy();
      engineRef.current = null;
    };
  }, [enabled]);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    if (isPageVisible) {
      setPaused(false);
      if (status === "ready" || status === "calibrating") {
        engine.start();
      }
    } else {
      setPaused(true);
      engine.stop();
    }
  }, [isPageVisible, status]);

  return { 
    videoRef, 
    status, 
    error, 
    pose, 
    lastGesture, 
    paused, 
    baselinePose, 
    recalibrate, 
    updateConfig 
  };
}
