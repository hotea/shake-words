import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "sw_session";
const TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET environment variable is required for mysql auth");
  }
  return secret;
}

/**
 * Create a signed session token for a user.
 * Format: userId.timestamp.signature
 */
export function createSessionToken(userId: string): string {
  const ts = Date.now().toString(36);
  const secret = getSecret();
  const sig = crypto
    .createHmac("sha256", secret)
    .update(`${userId}.${ts}`)
    .digest("hex")
    .slice(0, 32);
  return `${userId}.${ts}.${sig}`;
}

/**
 * Verify a session token and return the userId, or null if invalid.
 */
export function verifySessionToken(token: string): string | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [userId, ts, sig] = parts;

  // Check expiry
  const created = parseInt(ts, 36);
  if (Date.now() - created > TOKEN_EXPIRY_MS) return null;

  // Verify signature
  const secret = getSecret();
  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(`${userId}.${ts}`)
    .digest("hex")
    .slice(0, 32);

  if (sig !== expectedSig) return null;

  return userId;
}

/**
 * Get the current user ID from the session cookie.
 * Returns null if not authenticated.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * Set the session cookie on a response.
 */
export function setSessionCookie(token: string): { name: string; value: string; options: Record<string, unknown> } {
  return {
    name: COOKIE_NAME,
    value: token,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    },
  };
}

/**
 * Clear the session cookie.
 */
export function clearSessionCookie(): { name: string; value: string; options: Record<string, unknown> } {
  return {
    name: COOKIE_NAME,
    value: "",
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 0,
    },
  };
}
