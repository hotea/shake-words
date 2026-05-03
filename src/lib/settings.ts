// ============================================================
// Settings persistence (localStorage)
// ============================================================

import { DEFAULT_CONFIG, type GestureEngineConfig } from "@/lib/gesture-engine";

const SETTINGS_KEY = "sw_settings";

export interface AppSettings {
  gesture: GestureEngineConfig;
  /** Whether to show the raw camera feed. If false, show an animated illustration instead. */
  showCamera: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  gesture: { ...DEFAULT_CONFIG },
  showCamera: true,
};

export function loadSettings(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      gesture: { ...DEFAULT_CONFIG, ...parsed.gesture },
      showCamera: parsed.showCamera !== undefined ? parsed.showCamera : true,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
