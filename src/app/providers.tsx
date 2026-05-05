"use client";

import { SupabaseAuthProvider, MySqlAuthProvider } from "@/lib/auth";
import type { ReactNode } from "react";

const backendType = process.env.NEXT_PUBLIC_BACKEND_TYPE || "mysql";

export function Providers({ children }: { children: ReactNode }) {
  if (backendType === "supabase") {
    return <SupabaseAuthProvider>{children}</SupabaseAuthProvider>;
  }
  return <MySqlAuthProvider>{children}</MySqlAuthProvider>;
}
