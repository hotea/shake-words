import type { BackendAdapter } from "./types";
import { LocalStorageAdapter } from "./local";

export type { BackendAdapter } from "./types";

/** Create a backend adapter based on environment config */
export function createAdapter(): BackendAdapter {
  const backendType = process.env.NEXT_PUBLIC_BACKEND_TYPE || "local";

  switch (backendType) {
    case "supabase": {
      // Dynamic import check — only use Supabase if env vars are set
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (url && key) {
        // Lazy import to avoid bundling Supabase when not needed
        const { getSupabaseClient } = require("@/lib/supabase/client");
        const client = getSupabaseClient();
        if (client) {
          const { SupabaseAdapter } = require("./supabase");
          return new SupabaseAdapter(client);
        }
      }
      console.warn("Supabase env vars not set, falling back to local");
      return new LocalStorageAdapter();
    }

    case "rest":
      // TODO: implement RestApiAdapter
      console.warn("REST adapter not yet implemented, falling back to local");
      return new LocalStorageAdapter();

    case "local":
    default:
      return new LocalStorageAdapter();
  }
}

/** Singleton adapter instance */
let _adapter: BackendAdapter | null = null;

export function getAdapter(): BackendAdapter {
  if (!_adapter) {
    _adapter = createAdapter();
  }
  return _adapter;
}

/** Reset the singleton (call after login/logout to switch adapters) */
export function resetAdapter(): void {
  _adapter = null;
}
