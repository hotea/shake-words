"use client";

import { useState, useEffect, useRef } from "react";
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
  icon: React.ReactNode;
  onChange: (v: number) => void;
}

function SliderField({ label, description, value, min, max, step, unit, icon, onChange }: SliderFieldProps) {
  return (
    <div className="py-5 border-b border-[var(--glass-border)] last:border-b-0">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-dim)] text-[var(--color-primary-light)] flex items-center justify-center shrink-0 mt-0.5">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-0.5">
            <span className="font-medium text-sm">{label}</span>
            <span className="text-sm font-mono font-semibold text-[var(--color-primary-light)]">
              {value}{unit}
            </span>
          </div>
          <p className="text-xs text-[var(--color-muted)] leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="pl-11">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] text-[var(--color-muted)]/60 mt-1">
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  function updateGesture(key: string, value: number) {
    const updated = {
      ...settings,
      gesture: { ...settings.gesture, [key]: value },
    };
    setSettings(updated);

    // Auto-save with debounce
    setSaveStatus("saving");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      saveSettings(updated);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 1500);
    }, 500);
  }

  function handleReset() {
    setSettings(DEFAULT_SETTINGS);
    saveSettings(DEFAULT_SETTINGS);
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 1500);
  }

  const g = settings.gesture;

  return (
    <main className="min-h-screen max-w-2xl mx-auto px-6 py-12">
      <div className="mb-10 animate-fade-in">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Back
        </Link>
        <h1 className="text-3xl font-bold mt-5">Settings</h1>
        <p className="text-[var(--color-muted)] mt-1.5">
          Fine-tune gesture detection sensitivity
        </p>
      </div>

      {/* Gesture thresholds */}
      <div className="card p-6 mb-6 animate-fade-in-up stagger-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Gesture Detection</h2>
          {saveStatus !== "idle" && (
            <span className={`text-xs px-2.5 py-1 rounded-full transition-all ${
              saveStatus === "saving"
                ? "text-[var(--color-warning)] bg-[var(--color-warning-dim)]"
                : "text-[var(--color-success)] bg-[var(--color-success-dim)]"
            }`}>
              {saveStatus === "saving" ? "Saving..." : "Saved"}
            </span>
          )}
        </div>

        <SliderField
          label="Pitch Threshold"
          description="Sensitivity for up/down nods. Lower = more sensitive. If downward nods aren't detected, try lowering this."
          value={g.pitchThreshold}
          min={3}
          max={25}
          step={1}
          unit="&deg;"
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5-7.5L16.5 3m0 0L12 7.5m4.5-4.5v13.5" />
            </svg>
          }
          onChange={(v) => updateGesture("pitchThreshold", v)}
        />

        <SliderField
          label="Yaw Threshold"
          description="Sensitivity for left/right head turns. Lower = more sensitive."
          value={g.yawThreshold}
          min={5}
          max={30}
          step={1}
          unit="&deg;"
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
          }
          onChange={(v) => updateGesture("yawThreshold", v)}
        />

        <SliderField
          label="Sustain Time"
          description="How long to hold a gesture before it confirms. Lower = faster but more accidental triggers."
          value={g.sustainMs}
          min={100}
          max={800}
          step={50}
          unit="ms"
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          }
          onChange={(v) => updateGesture("sustainMs", v)}
        />

        <SliderField
          label="Cooldown Time"
          description="Minimum wait between gestures. Prevents double-triggers."
          value={g.cooldownMs}
          min={300}
          max={2000}
          step={100}
          unit="ms"
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
            </svg>
          }
          onChange={(v) => updateGesture("cooldownMs", v)}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 animate-fade-in-up stagger-2">
        <button onClick={handleReset} className="btn-ghost text-sm">
          Reset to Defaults
        </button>
      </div>

      <p className="mt-8 text-xs text-[var(--color-muted)]/60">
        Changes auto-save and take effect on the next quiz session.
      </p>
    </main>
  );
}
