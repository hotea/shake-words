type CodeEntry = { code: string; expiresAt: number; sentAt: number };

const store = new Map<string, CodeEntry>();

const CODE_TTL = 5 * 60 * 1000;
const RESEND_INTERVAL = 60 * 1000;

export function setEmailCode(email: string, code: string): void {
  store.set(email.toLowerCase(), {
    code,
    expiresAt: Date.now() + CODE_TTL,
    sentAt: Date.now(),
  });
}

export function getEmailCode(email: string): string | null {
  const entry = store.get(email.toLowerCase());
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(email.toLowerCase());
    return null;
  }
  return entry.code;
}

export function getAndClearEmailCode(email: string): string | null {
  const code = getEmailCode(email);
  store.delete(email.toLowerCase());
  return code;
}

export function isEmailCodeSentRecently(email: string): boolean {
  const entry = store.get(email.toLowerCase());
  if (!entry) return false;
  return Date.now() - entry.sentAt < RESEND_INTERVAL;
}

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.expiresAt) store.delete(key);
  }
}, 60 * 1000);
