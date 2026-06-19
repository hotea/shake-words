"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";

export function AuthHeader() {
  const { user, loading, signOut } = useAuth();

  return (
    <div
      className="flex items-center gap-2 px-2 py-1.5"
      style={{
        background: "rgba(10, 18, 14, 0.6)",
        border: "1px solid rgba(106, 170, 138, 0.15)",
        borderRadius: "999px",
        backdropFilter: "blur(8px)",
      }}
    >
      {loading ? (
        <div className="w-7 h-7 flex items-center justify-center">
          <div
            className="w-4 h-4 border-2 rounded-full animate-spin"
            style={{
              borderColor: "var(--color-cinnabar)",
              borderTopColor: "transparent",
            }}
          />
        </div>
      ) : user ? (
        <>
          <Link
            href="/account"
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-opacity hover:opacity-80"
            style={{
              fontFamily: "var(--font-brand)",
              background:
                "linear-gradient(135deg, var(--color-jade) 0%, var(--color-jade-deep) 100%)",
              color: "var(--color-ink-900)",
              boxShadow: "0 2px 8px rgba(106, 170, 138, 0.3)",
            }}
            title="账户管理"
          >
            {(user.email?.[0] ?? user.name?.[0] ?? "U").toUpperCase()}
          </Link>
          <button
            onClick={() => signOut()}
            className="text-xs px-3 py-1 rounded-full transition-colors"
            style={{
              color: "var(--color-muted)",
              fontFamily: "var(--font-display)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--color-rice)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--color-muted)")
            }
          >
            退出
          </button>
        </>
      ) : (
        <Link
          href="/login"
          className="flex items-center justify-center w-7 h-7 rounded-full transition-colors"
          style={{ color: "var(--color-muted)" }}
          title="登录"
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--color-gold)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--color-muted)")
          }
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
        </Link>
      )}
    </div>
  );
}
