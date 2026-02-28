"use client";

import Link from "next/link";
import { useAuth } from "@/lib/supabase/auth-context";

export function AuthHeader() {
  const { user, loading, supabaseEnabled, signOut } = useAuth();

  // Don't render if Supabase is not configured
  if (!supabaseEnabled) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      {loading ? (
        <div className="w-5 h-5 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      ) : user ? (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-xs font-bold">
            {(user.email?.[0] ?? user.user_metadata?.name?.[0] ?? "U").toUpperCase()}
          </div>
          <button
            onClick={() => signOut()}
            className="text-xs px-2 py-1 rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:border-[var(--color-primary)] transition-colors"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <Link
          href="/login"
          className="text-xs px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:border-[var(--color-primary)] transition-colors"
        >
          Sign In
        </Link>
      )}
    </div>
  );
}
