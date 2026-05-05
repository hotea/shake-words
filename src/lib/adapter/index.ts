import type { BackendAdapter } from "./types";
import { RestAdapter } from "./rest";

export type { BackendAdapter } from "./types";

export async function createAdapter(): Promise<BackendAdapter> {
  const backendType = process.env.NEXT_PUBLIC_BACKEND_TYPE || "mysql";

  switch (backendType) {
    case "supabase": {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (url && key) {
        const { getSupabaseClient } = await import("@/lib/supabase/client");
        const client = getSupabaseClient();
        if (client) {
          const { SupabaseAdapter } = await import("./supabase");
          return new SupabaseAdapter(client);
        }
      }
      throw new Error("Supabase env vars (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) are required for supabase mode");
    }

    case "mysql":
    default: {
      if (typeof window !== "undefined") {
        return new RestAdapter();
      }
      throw new Error("Server-side MySqlAdapter requires a userId. Use new MySqlAdapter(userId) in API routes.");
    }
  }
}

/** Singleton adapter instance */
let _adapter: BackendAdapter | null = null;
let _adapterPromise: Promise<BackendAdapter> | null = null;

export function getAdapter(): Promise<BackendAdapter> {
  if (_adapter) return Promise.resolve(_adapter);
  if (!_adapterPromise) {
    _adapterPromise = createAdapter().then((a) => {
      _adapter = a;
      return a;
    });
  }
  return _adapterPromise;
}

/** Reset the singleton (call after login/logout to switch adapters) */
export function resetAdapter(): void {
  _adapter = null;
  _adapterPromise = null;
}
