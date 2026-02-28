// ============================================================
// Settings persistence (localStorage)
// ============================================================

import { DEFAULT_CONFIG, type GestureEngineConfig } from "@/lib/gesture-engine";

const SETTINGS_KEY = "sw_settings";

export interface AppSettings {
  gesture: GestureEngineConfig;
}

export const DEFAULT_SETTINGS: AppSettings = {
  gesture: { ...DEFAULT_CONFIG },
};

export function loadSettings(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      gesture: { ...DEFAULT_CONFIG, ...parsed.gesture },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
