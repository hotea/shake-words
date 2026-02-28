"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { loadSettings, saveSettings, DEFAULT_SETTINGS, type AppSettings } from "@/lib/settings";

interface SliderFieldProps {
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}

function SliderField({ label, description, value, min, max, step, unit, onChange }: SliderFieldProps) {
  return (
    <div className="py-4 border-b border-[var(--color-border)] last:border-b-0">
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium text-sm">{label}</span>
        <span className="text-sm font-mono text-[var(--color-primary)]">
          {value}{unit}
        </span>
      </div>
      <p className="text-xs text-[var(--color-muted)] mb-3">{description}</p>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-[var(--color-border)] rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
      />
      <div className="flex justify-between text-[10px] text-[var(--color-muted)] mt-1">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  function updateGesture(key: string, value: number) {
    setSaved(false);
    setSettings((prev) => ({
      ...prev,
      gesture: { ...prev.gesture, [key]: value },
    }));
  }

  function handleSave() {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    setSettings(DEFAULT_SETTINGS);
    saveSettings(DEFAULT_SETTINGS);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const g = settings.gesture;

  return (
    <main className="min-h-screen max-w-2xl mx-auto px-6 py-12">
      <div className="mb-8">
        <Link
          href="/"
          className="text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
        >
          &larr; Back
        </Link>
        <h1 className="text-3xl font-bold mt-4">Settings</h1>
        <p className="text-[var(--color-muted)] mt-1">
          Adjust gesture detection sensitivity
        </p>
      </div>

      {/* Gesture thresholds */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 mb-6">
        <h2 className="text-lg font-semibold mb-2">Gesture Detection</h2>

        <SliderField
          label="Pitch Threshold (Up/Down)"
          description="Lower = more sensitive to nods. If downward nods aren't detected, try lowering this."
          value={g.pitchThreshold}
          min={3}
          max={25}
          step={1}
          unit="&deg;"
          onChange={(v) => updateGesture("pitchThreshold", v)}
        />

        <SliderField
          label="Yaw Threshold (Left/Right)"
          description="Lower = more sensitive to head turns."
          value={g.yawThreshold}
          min={5}
          max={30}
          step={1}
          unit="&deg;"
          onChange={(v) => updateGesture("yawThreshold", v)}
        />

        <SliderField
          label="Sustain Time"
          description="How long you must hold the gesture before it's confirmed. Lower = faster but more accidental triggers."
          value={g.sustainMs}
          min={100}
          max={800}
          step={50}
          unit="ms"
          onChange={(v) => updateGesture("sustainMs", v)}
        />

        <SliderField
          label="Cooldown Time"
          description="Minimum wait between two gestures. Prevents double-triggers."
          value={g.cooldownMs}
          min={300}
          max={2000}
          step={100}
          unit="ms"
          onChange={(v) => updateGesture("cooldownMs", v)}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-white font-semibold transition-colors"
        >
          {saved ? "Saved!" : "Save Settings"}
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:border-[var(--color-primary)] font-semibold transition-colors"
        >
          Reset to Defaults
        </button>
      </div>

      <p className="mt-6 text-xs text-[var(--color-muted)]">
        Changes take effect on the next quiz session. Settings are saved in your browser.
      </p>
    </main>
  );
}
