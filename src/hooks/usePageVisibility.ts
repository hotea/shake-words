"use client";

import { useState, useEffect } from "react";

/**
 * Hook to track page visibility and focus state.
 * Returns true when the page is visible AND focused.
 * Detects:
 *   - Tab switching (visibilitychange)
 *   - Window losing focus to another app (blur/focus)
 */
export function usePageVisibility(): boolean {
  const [isActive, setIsActive] = useState(() => {
    if (typeof window === "undefined") return true; // SSR safe
    return !document.hidden && document.hasFocus();
  });

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.hidden) {
        setIsActive(false);
      } else {
        // When tab becomes visible again, also check if window has focus
        setIsActive(document.hasFocus());
      }
    }

    function handleWindowBlur() {
      setIsActive(false);
    }

    function handleWindowFocus() {
      // Only set active if the page is also visible (not in a hidden tab)
      setIsActive(!document.hidden);
    }

    // Initial state
    setIsActive(!document.hidden && document.hasFocus());

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, []);

  return isActive;
}
