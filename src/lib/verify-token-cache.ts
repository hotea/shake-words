const TOKEN_TTL = 30 * 60 * 1000;
const RESEND_INTERVAL = 60 * 1000;

interface VerifyEntry {
  token: string;
  createdAt: number;
}

const store = new Map<string, VerifyEntry>();

function cleanup() {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now - entry.createdAt > TOKEN_TTL) {
      store.delete(key);
    }
  }
}

setInterval(cleanup, 5 * 60 * 1000);

export function createVerifyToken(userId: string): string {
  const token = crypto.randomUUID().replace(/-/g, "");
  store.set(userId, { token, createdAt: Date.now() });
  return token;
}

export function verifyEmailToken(userId: string, token: string): boolean {
  const entry = store.get(userId);
  if (!entry) return false;
  if (Date.now() - entry.createdAt > TOKEN_TTL) {
    store.delete(userId);
    return false;
  }
  if (entry.token !== token) return false;
  store.delete(userId);
  return true;
}

export function isVerifyLinkSentRecently(userId: string): boolean {
  const entry = store.get(userId);
  if (!entry) return false;
  return Date.now() - entry.createdAt < RESEND_INTERVAL;
}
