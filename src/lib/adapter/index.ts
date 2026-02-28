import type { BackendAdapter } from "./types";
import { LocalStorageAdapter } from "./local";

export type { BackendAdapter } from "./types";

/** Create a backend adapter based on environment config */
export function createAdapter(): BackendAdapter {
  const backendType = process.env.NEXT_PUBLIC_BACKEND_TYPE || "local";

  switch (backendType) {
    case "supabase":
      // TODO: implement SupabaseAdapter
      console.warn("Supabase adapter not yet implemented, falling back to local");
      return new LocalStorageAdapter();

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
