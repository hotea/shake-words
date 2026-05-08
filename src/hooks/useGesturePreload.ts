"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export type PreloadPhase = 
  | "idle" 
  | "loading_wasm" 
  | "loading_model" 
  | "starting_camera" 
  | "ready" 
  | "error";

export interface PreloadProgress {
  phase: PreloadPhase;
  progress: number; // 0-100
  message: string;
}

interface UseGesturePreloadOptions {
  externalVideoRef?: React.RefObject<HTMLVideoElement | null>;
}

interface UseGesturePreloadReturn {
  preload: () => Promise<void>;
  progress: PreloadProgress;
  isReady: boolean;
  error: string | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  faceLandmarker: any;
  stream: MediaStream | null;
}

const PHASE_MESSAGES: Record<PreloadPhase, string> = {
  idle: "准备中...",
  loading_wasm: "加载视觉识别引擎...",
  loading_model: "加载面部识别模型...",
  starting_camera: "启动摄像头...",
  ready: "准备就绪",
  error: "初始化失败",
};

export function useGesturePreload(options: UseGesturePreloadOptions = {}): UseGesturePreloadReturn {
  const internalVideoRef = useRef<HTMLVideoElement | null>(null);
  const videoRef = options.externalVideoRef || internalVideoRef;
  const [progress, setProgress] = useState<PreloadProgress>({
    phase: "idle",
    progress: 0,
    message: PHASE_MESSAGES.idle,
  });
  const [error, setError] = useState<string | null>(null);
  const [faceLandmarker, setFaceLandmarker] = useState<any>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const updateProgress = useCallback((phase: PreloadPhase, progressValue: number) => {
    setProgress({
      phase,
      progress: progressValue,
      message: PHASE_MESSAGES[phase],
    });
  }, []);

  // Keep track if we already set up the video
  const videoSetUp = useRef(false);

  const preload = useCallback(async () => {
    if (progress.phase !== "idle" && progress.phase !== "error") {
      return; // 已经在加载中或已就绪
    }

    setError(null);
    
    try {
      // Phase 1: Load WASM (0-30%)
      updateProgress("loading_wasm", 5);
      const { FaceLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
      updateProgress("loading_wasm", 20);

      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      updateProgress("loading_wasm", 30);

      // Phase 2: Load Model (30-70%)
      updateProgress("loading_model", 35);
      const landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numFaces: 1,
        outputFaceBlendshapes: false,
        outputFacialTransformationMatrixes: false,
      });
      updateProgress("loading_model", 70);
      setFaceLandmarker(landmarker);

      // Phase 3: Start Camera (70-100%)
      updateProgress("starting_camera", 75);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      updateProgress("starting_camera", 90);

      // Wait for video element to be available
      let attempts = 0;
      while (!videoRef.current && attempts < 100) {
        await new Promise((r) => setTimeout(r, 50));
        attempts++;
      }

      if (videoRef.current && !videoSetUp.current) {
        // Only set up the video once!
        videoSetUp.current = true;
        
        // Set video source
        videoRef.current.srcObject = mediaStream;
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        videoRef.current.autoplay = true;
        
        // Wait for video to be ready
        await new Promise<void>((resolve) => {
          if (videoRef.current!.readyState >= 2) {
            resolve();
          } else {
            videoRef.current!.onloadedmetadata = () => resolve();
          }
        });
        
        // Play video - but don't wait for it, just let it happen
        videoRef.current.play().catch(e => {
          console.warn("[useGesturePreload] video play failed:", e);
        });
      }

      setStream(mediaStream);
      updateProgress("ready", 100);
    } catch (err) {
      console.error("[useGesturePreload] preload failed:", err);
      let msg: string;
      if (err instanceof Error) {
        msg = err.message;
      } else {
        msg = "初始化失败，请检查摄像头权限";
      }
      setError(msg);
      updateProgress("error", 0);
    }
  }, [progress.phase, updateProgress]);

  return {
    preload,
    progress,
    isReady: progress.phase === "ready",
    error,
    videoRef,
    faceLandmarker,
    stream,
  };
}
