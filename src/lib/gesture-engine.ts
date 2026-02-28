// ============================================================
// Gesture Engine — Head pose estimation via MediaPipe Face Mesh
// ============================================================
//
// Uses MediaPipe FaceLandmarker to extract 478 face landmarks,
// then computes head pitch/yaw from key landmark positions to
// detect up/down/left/right head gestures.
//
// Key landmarks used:
//   - Nose tip: 1
//   - Forehead: 10
//   - Chin: 152
//   - Left ear: 234
//   - Right ear: 454
//
// The engine emits GestureEvents when a directional head
// movement exceeds the threshold and is sustained.
// ============================================================

import type { GestureDirection, GestureEvent, HeadPose } from "@/lib/types";

export interface GestureEngineConfig {
  /** Yaw angle threshold (degrees) for left/right detection. Default: 15 */
  yawThreshold: number;
  /** Pitch angle threshold (degrees) for up/down detection. Default: 10 */
  pitchThreshold: number;
  /** Minimum sustain time (ms) before gesture is confirmed. Default: 300 */
  sustainMs: number;
  /** Cooldown time (ms) after a gesture before next one. Default: 800 */
  cooldownMs: number;
  /** Target FPS for face detection. Default: 15 */
  targetFps: number;
}

export const DEFAULT_CONFIG: GestureEngineConfig = {
  yawThreshold: 15,
  pitchThreshold: 10,
  sustainMs: 300,
  cooldownMs: 800,
  targetFps: 15,
};

type GestureCallback = (event: GestureEvent) => void;
type PoseCallback = (pose: HeadPose) => void;

interface Landmark {
  x: number;
  y: number;
  z: number;
}

export class GestureEngine {
  private config: GestureEngineConfig;
  private onGesture: GestureCallback | null = null;
  private onPose: PoseCallback | null = null;
  private faceLandmarker: unknown = null;
  private video: HTMLVideoElement | null = null;
  private animFrameId: number | null = null;
  private running = false;

  // Baseline (neutral) pose — captured during calibration
  private baselinePose: HeadPose | null = null;
  private calibrationSamples: HeadPose[] = [];

  // Gesture detection state
  private pendingDirection: GestureDirection | null = null;
  private pendingStartTime = 0;
  private lastGestureTime = 0;
  private lastFrameTime = 0;

  constructor(config?: Partial<GestureEngineConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /** Update config at runtime (e.g. from settings UI) */
  updateConfig(partial: Partial<GestureEngineConfig>): void {
    this.config = { ...this.config, ...partial };
  }

  /** Get current config (read-only copy) */
  getConfig(): GestureEngineConfig {
    return { ...this.config };
  }

  /** Register gesture callback */
  setGestureCallback(cb: GestureCallback): void {
    this.onGesture = cb;
  }

  /** Register continuous pose callback (for UI overlay) */
  setPoseCallback(cb: PoseCallback): void {
    this.onPose = cb;
  }

  /** Initialize MediaPipe FaceLandmarker and camera */
  async init(videoElement: HTMLVideoElement): Promise<void> {
    this.video = videoElement;

    // Dynamic import to avoid SSR issues
    const { FaceLandmarker, FilesetResolver } = await import(
      "@mediapipe/tasks-vision"
    );

    const filesetResolver = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    this.faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
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

    // Start camera
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user", width: 640, height: 480 },
    });
    this.video.srcObject = stream;
    await this.video.play();
  }

  /** Start detection loop */
  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastFrameTime = 0;
    this.detect();
  }

  /** Stop detection loop */
  stop(): void {
    this.running = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  /** Destroy resources */
  destroy(): void {
    this.stop();
    if (this.video?.srcObject) {
      const tracks = (this.video.srcObject as MediaStream).getTracks();
      tracks.forEach((t) => t.stop());
      this.video.srcObject = null;
    }
    this.faceLandmarker = null;
  }

  /** Begin calibration: collect N samples of neutral pose */
  startCalibration(): void {
    this.calibrationSamples = [];
    this.baselinePose = null;
  }

  /** End calibration and set baseline */
  endCalibration(): boolean {
    if (this.calibrationSamples.length < 5) return false;
    const avg: HeadPose = { pitch: 0, yaw: 0, roll: 0 };
    for (const s of this.calibrationSamples) {
      avg.pitch += s.pitch;
      avg.yaw += s.yaw;
      avg.roll += s.roll;
    }
    const n = this.calibrationSamples.length;
    avg.pitch /= n;
    avg.yaw /= n;
    avg.roll /= n;
    this.baselinePose = avg;
    return true;
  }

  /** Auto-calibrate: use first 30 frames as neutral */
  isCalibrating(): boolean {
    return this.baselinePose === null;
  }

  // =========================================================
  // Private methods
  // =========================================================

  private detect = (): void => {
    if (!this.running) return;

    const now = performance.now();
    const frameInterval = 1000 / this.config.targetFps;

    if (now - this.lastFrameTime < frameInterval) {
      this.animFrameId = requestAnimationFrame(this.detect);
      return;
    }
    this.lastFrameTime = now;

    if (!this.video || !this.faceLandmarker) {
      this.animFrameId = requestAnimationFrame(this.detect);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fl = this.faceLandmarker as any;
    const result = fl.detectForVideo(this.video, now);

    if (result?.faceLandmarks?.length > 0) {
      const landmarks: Landmark[] = result.faceLandmarks[0];
      const pose = this.computeHeadPose(landmarks);

      // Auto-calibration
      if (this.isCalibrating()) {
        this.calibrationSamples.push(pose);
        if (this.calibrationSamples.length >= 30) {
          this.endCalibration();
        }
      }

      this.onPose?.(pose);

      if (this.baselinePose) {
        this.processGesture(pose, now);
      }
    }

    this.animFrameId = requestAnimationFrame(this.detect);
  };

  /**
   * Compute head pitch and yaw from face landmarks.
   *
   * Yaw: horizontal offset of nose tip relative to midpoint of ears.
   * Pitch: combines two signals for robust up/down detection:
   *   1. Y-axis: vertical offset of nose relative to forehead-chin midpoint
   *   2. Z-axis: depth ratio of forehead vs chin (tilting down brings forehead
   *      forward / chin backward and vice versa)
   * Blending both avoids the common problem where pure Y-based pitch barely
   * changes on downward nods because the whole face translates together.
   */
  private computeHeadPose(landmarks: Landmark[]): HeadPose {
    const noseTip = landmarks[1];
    const forehead = landmarks[10];
    const chin = landmarks[152];
    const leftEar = landmarks[234];
    const rightEar = landmarks[454];

    // Face width and height for normalization
    const faceWidth = Math.sqrt(
      (rightEar.x - leftEar.x) ** 2 + (rightEar.z - leftEar.z) ** 2
    );
    const faceHeight = Math.sqrt(
      (chin.y - forehead.y) ** 2 + (chin.z - forehead.z) ** 2
    );

    // --- Yaw ---
    const earMidX = (leftEar.x + rightEar.x) / 2;
    const yawRatio = (noseTip.x - earMidX) / (faceWidth || 1);
    const yaw = yawRatio * -60;

    // --- Pitch (blended Y + Z) ---
    // Signal 1: Y-based — nose vertical offset from forehead-chin midpoint
    const vertMidY = (forehead.y + chin.y) / 2;
    const pitchRatioY = (noseTip.y - vertMidY) / (faceHeight || 1);
    const pitchY = pitchRatioY * -60;

    // Signal 2: Z-based — when head tilts down, forehead.z decreases (moves
    // towards camera) and chin.z increases (moves away), producing a negative
    // delta; when tilting up the opposite happens.
    const zDelta = forehead.z - chin.z;
    // Normalize by face height in z-space (approximate)
    const faceDepth = faceWidth || 0.1; // ear-to-ear distance as depth proxy
    const pitchZ = (zDelta / faceDepth) * 80;

    // Blend: 40% Y-signal + 60% Z-signal. The Z component is more reliable
    // for downward nods where the Y displacement is small.
    const pitch = pitchY * 0.4 + pitchZ * 0.6;

    // --- Roll ---
    const roll = Math.atan2(rightEar.y - leftEar.y, rightEar.x - leftEar.x) * (180 / Math.PI);

    return { pitch, yaw, roll };
  }

  /**
   * Process head pose into gesture events with sustain + cooldown logic.
   */
  private processGesture(pose: HeadPose, now: number): void {
    if (!this.baselinePose) return;

    // Relative to baseline
    const dPitch = pose.pitch - this.baselinePose.pitch;
    const dYaw = pose.yaw - this.baselinePose.yaw;

    // Determine direction
    let direction: GestureDirection | null = null;
    let confidence = 0;

    const absPitch = Math.abs(dPitch);
    const absYaw = Math.abs(dYaw);

    // Pick dominant axis. Give pitch a 1.3x boost when comparing axes because
    // head tilts produce smaller angular changes than left/right turns.
    const pitchWeight = absPitch * 1.3;

    if (absYaw > pitchWeight && absYaw > this.config.yawThreshold) {
      direction = dYaw > 0 ? "right" : "left";
      confidence = Math.min(absYaw / (this.config.yawThreshold * 2), 1);
    } else if (absPitch > this.config.pitchThreshold) {
      direction = dPitch > 0 ? "up" : "down";
      confidence = Math.min(absPitch / (this.config.pitchThreshold * 2), 1);
    }

    // Cooldown check
    if (now - this.lastGestureTime < this.config.cooldownMs) {
      this.pendingDirection = null;
      return;
    }

    if (direction === null) {
      // Head is near neutral — reset pending
      this.pendingDirection = null;
      return;
    }

    if (direction === this.pendingDirection) {
      // Same direction — check sustain
      if (now - this.pendingStartTime >= this.config.sustainMs) {
        // Fire gesture!
        this.lastGestureTime = now;
        this.pendingDirection = null;

        const event: GestureEvent = {
          direction,
          confidence,
          timestamp: now,
        };
        this.onGesture?.(event);
      }
    } else {
      // New direction — start tracking
      this.pendingDirection = direction;
      this.pendingStartTime = now;
    }
  }
}
