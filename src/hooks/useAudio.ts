"use client";

import { useCallback, useRef, useEffect } from "react";

export function useAudio() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const wakeUpSpeech = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.resume();
    } catch {}
  };

  const speak = useCallback((word: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    try {
      // Don't cancel, just let the queue handle it
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = "en-US";
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const enVoice = voices.find(
        (v) => v.lang.startsWith("en") && v.localService
      ) || voices.find((v) => v.lang.startsWith("en"));
      if (enVoice) utterance.voice = enVoice;

      // Speak the word
      window.speechSynthesis.speak(utterance);
      
      // Keep the speech synthesis alive
      setTimeout(() => {
        if (window.speechSynthesis && window.speechSynthesis.paused) {
          try {
            window.speechSynthesis.resume();
          } catch {}
        }
      }, 50);
    } catch (e) {
      console.error("Speak error:", e);
    }
  }, []);

  const playCorrect = useCallback(() => {
    try {
      const ctx = getCtx();
      const now = ctx.currentTime;

      [523.25, 659.25].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, now + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.18, now + i * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.35);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.4);
      });
    } catch {}
  }, []);

  const playWrong = useCallback(() => {
    try {
      const ctx = getCtx();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.linearRampToValueAtTime(180, now + 0.25);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch {}
  }, []);

  const getCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.getVoices();
    const voicesChanged = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener("voiceschanged", voicesChanged);

    const interval = setInterval(() => {
      try {
        window.speechSynthesis.resume();
      } catch {}
    }, 1000);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", voicesChanged);
      clearInterval(interval);
    };
  }, []);

  return { speak, playCorrect, playWrong };
}
