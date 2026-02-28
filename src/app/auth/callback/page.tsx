"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";

/**
 * OAuth callback handler.
 * Supabase automatically exchanges the code in the URL hash for a session.
 * We just need to wait for it and redirect.
 */
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      router.replace("/");
      return;
    }

    // The supabase-js client auto-parses the hash fragment on load.
    // Wait briefly for the session to be established, then redirect.
    supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        router.replace("/");
      }
    });

    // Fallback redirect after 5s
    const timer = setTimeout(() => router.replace("/"), 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[var(--color-muted)]">Signing in...</p>
      </div>
    </main>
  );
}
