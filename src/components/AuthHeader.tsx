"use client";

import Link from "next/link";
import { useAuth } from "@/lib/supabase/auth-context";

export function AuthHeader() {
  const { user, loading, signOut } = useAuth();

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="glass flex items-center gap-2 rounded-full px-1.5 py-1.5">
        {loading ? (
          <div className="w-7 h-7 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : user ? (
          <>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[#8b5cf6] flex items-center justify-center text-white text-xs font-bold shadow-md">
              {(user.email?.[0] ?? user.user_metadata?.name?.[0] ?? "U").toUpperCase()}
            </div>
            <button
              onClick={() => signOut()}
              className="text-xs px-3 py-1 rounded-full text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-xs px-3.5 py-1 rounded-full text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
