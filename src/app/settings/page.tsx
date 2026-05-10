"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { loadSettings, saveSettings, DEFAULT_SETTINGS, type AppSettings } from "@/lib/settings";
import { VERSION, BUILD_TIME } from "@/lib/version";

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
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="py-5 border-b border-[var(--color-border)]/50 last:border-b-0">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-[var(--color-primary-dim)] text-[var(--color-primary)] flex items-center justify-center shrink-0 mt-0.5">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <span className="font-medium text-sm text-[var(--color-foreground)]">{label}</span>
            <span className="text-sm font-mono font-semibold text-[var(--color-primary)] tabular-nums">
              {value}{unit}
            </span>
          </div>
          <p className="text-xs text-[var(--color-muted)] leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="pl-12">
        <div className="relative h-6 flex items-center">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full relative z-10"
            style={{ background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${pct}%, rgba(0,0,0,0.06) ${pct}%, rgba(0,0,0,0.06) 100%)` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-[var(--color-muted)]/60 mt-0.5">
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      </div>
    </div>
  );
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  } catch {
    return dateStr;
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  function updateGesture(key: string, value: number) {
    const updated = { ...settings, gesture: { ...settings.gesture, [key]: value } };
    setSettings(updated);
    setSaveStatus("saving");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      saveSettings(updated);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 1500);
    }, 500);
  }

  function updateSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
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
    <main className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors mb-5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            返回
          </Link>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)]" style={{ fontFamily: "var(--font-heading)" }}>设置</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">调整手势检测灵敏度</p>
        </div>

        {/* Gesture Card */}
        <div className="card p-6 mb-6 animate-fade-in-up stagger-1">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-base font-semibold text-[var(--color-foreground)]">手势检测</h2>
            {saveStatus !== "idle" && (
              <span className={`text-xs px-2.5 py-1 rounded-full transition-all font-medium ${
                saveStatus === "saving"
                  ? "text-[var(--color-warning)] bg-[var(--color-warning-dim)]"
                  : "text-[var(--color-success)] bg-[var(--color-success-dim)]"
              }`}>
                {saveStatus === "saving" ? "保存中..." : "已保存"}
              </span>
            )}
          </div>

          <SliderField
            label="俯仰阈值"
            description="上下点头的灵敏度。数值越低越灵敏。"
            value={g.pitchThreshold}
            min={3}
            max={25}
            step={1}
            unit="°"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5-7.5L16.5 3m0 0L12 7.5m4.5-4.5v13.5" />
              </svg>
            }
            onChange={(v) => updateGesture("pitchThreshold", v)}
          />

          <SliderField
            label="偏航阈值"
            description="左右转头的灵敏度。数值越低越灵敏。"
            value={g.yawThreshold}
            min={5}
            max={30}
            step={1}
            unit="°"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
            }
            onChange={(v) => updateGesture("yawThreshold", v)}
          />

          <SliderField
            label="保持时间"
            description="保持手势多久后确认。越低越快，但可能误触发。"
            value={g.sustainMs}
            min={100}
            max={800}
            step={50}
            unit="ms"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0Z" />
              </svg>
            }
            onChange={(v) => updateGesture("sustainMs", v)}
          />

          <SliderField
            label="冷却时间"
            description="两次手势之间的最小间隔。防止重复触发。"
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

        {/* Display Card */}
        <div className="card p-6 mb-6 animate-fade-in-up stagger-2">
          <h2 className="text-base font-semibold text-[var(--color-foreground)] mb-4">显示</h2>

          {/* Camera feed toggle */}
          <div className="flex items-center justify-between py-3 border-b border-[var(--color-border)]/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--color-primary-dim)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
              <div>
                <span className="font-medium text-sm text-[var(--color-foreground)]">摄像头画面</span>
                <p className="text-xs text-[var(--color-muted)] leading-relaxed">关闭后将用动画示意图代替原始摄像头图像</p>
              </div>
            </div>
            <button
              role="switch"
              aria-checked={settings.showCamera}
              onClick={() => updateSetting("showCamera", !settings.showCamera)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors shrink-0 ${
                settings.showCamera ? "bg-[var(--color-primary)]" : "bg-[var(--color-muted-subtle)]"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                  settings.showCamera ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Reset */}
        <div className="flex items-center gap-3 animate-fade-in-up stagger-2">
          <button onClick={handleReset} className="text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors px-3 py-2 rounded-lg hover:bg-[var(--color-background)]">
            恢复默认设置
          </button>
        </div>

        {/* Version Info */}
        <div className="mt-8 pt-6 border-t border-[var(--color-border)]/50 animate-fade-in-up stagger-2">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-[var(--color-muted)]/80 font-mono">
              版本: <span className="font-semibold text-[var(--color-primary)]">{VERSION}</span>
            </p>
            <p className="text-xs text-[var(--color-muted)]/60">
              构建时间: {formatDate(BUILD_TIME)}
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs text-[var(--color-muted)]/60">
          设置自动保存，下次测验时生效。
        </p>
      </div>
    </main>
  );
}
