"use client";

import { AuthProvider } from "@/lib/supabase/auth-context";
import { AuthHeader } from "@/components/AuthHeader";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AuthHeader />
      {children}
    </AuthProvider>
  );
}
