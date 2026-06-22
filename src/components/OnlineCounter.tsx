"use client";

import { useState, useEffect, useRef } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

interface OnlineCounterProps {
  className?: string;
}

export function OnlineCounter({ className = "" }: OnlineCounterProps) {
  const [count, setCount] = useState<number>(0);
  const [todayCount, setTodayCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [expanded, setExpanded] = useState(false);
  const visitorId = useRef<string>("");

  useEffect(() => {
    // 生成或获取匿名访客 ID
    let id = localStorage.getItem("sw_visitor_id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("sw_visitor_id", id);
    }
    visitorId.current = id;

    // 心跳上报函数
    const heartbeat = async () => {
      try {
        const response = await fetch(`${basePath}/api/online`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId: visitorId.current }),
        });
        if (response.ok) {
          const data = await response.json();
          setCount(data.count);
          setTodayCount(data.todayCount);
          setTotalCount(data.totalCount);
        }
      } catch (error) {
        console.error("[OnlineCounter] heartbeat failed:", error);
      }
    };

    // 立即上报一次
    heartbeat();

    // 每 30 秒心跳一次
    const interval = setInterval(heartbeat, 30000);

    // 页面可见性变化时上报
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        heartbeat();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  if (count <= 0) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <div className="flex items-center gap-2 px-3 py-2 bg-[var(--color-surface)]/90 backdrop-blur-sm rounded-full border border-[var(--color-border)] shadow-[var(--shadow-md)] text-sm text-[var(--color-muted)]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--color-jade)] opacity-50" />
          </span>
          <span className="font-medium" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.05em" }}>连接中...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex flex-col items-end gap-1.5 ${className}`}
    >
      {/* 展开状态：显示详细数据 */}
      {expanded && (
        <div className="mb-1 px-3 py-2 bg-[var(--color-surface)]/90 backdrop-blur-sm rounded-xl border border-[var(--color-border)] shadow-[var(--shadow-md)] text-xs text-[var(--color-muted)] animate-fade-in-up">
          <div className="flex items-center gap-2 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-jade)]" style={{ boxShadow: "0 0 6px rgba(106, 170, 138, 0.5)" }} />
            <span>今日 {todayCount} 人</span>
          </div>
          <div className="flex items-center gap-2 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-bamboo)]" style={{ boxShadow: "0 0 6px rgba(184, 164, 114, 0.5)" }} />
            <span>累计 {totalCount} 人</span>
          </div>
        </div>
      )}

      {/* 主按钮：当前在线 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 px-3 py-2 bg-[var(--color-surface)]/90 backdrop-blur-sm rounded-full border border-[var(--color-border)] shadow-[var(--shadow-md)] text-sm text-[var(--color-rice)] hover:border-[var(--color-bamboo)] hover:shadow-[var(--shadow-glow-bamboo)] transition-all cursor-pointer"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-jade)] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--color-jade)]" style={{ boxShadow: "0 0 8px rgba(106, 170, 138, 0.6)" }}></span>
        </span>
        <span className="font-medium" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.05em" }}>{count} 人在线</span>
        <svg
          className={`w-3.5 h-3.5 text-[var(--color-muted)] transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
    </div>
  );
}
