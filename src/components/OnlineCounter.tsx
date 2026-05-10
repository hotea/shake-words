"use client";

import { useState, useEffect, useRef } from "react";

interface OnlineCounterProps {
  className?: string;
}

export function OnlineCounter({ className = "" }: OnlineCounterProps) {
  const [count, setCount] = useState<number>(0);
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
        const response = await fetch("/api/online", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId: visitorId.current }),
        });
        if (response.ok) {
          const data = await response.json();
          setCount(data.count);
        }
      } catch (error) {
        // 静默失败，不影响主功能
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

  if (count <= 0) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm text-sm text-gray-600 ${className}`}
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
      </span>
      <span>{count} 人在线</span>
    </div>
  );
}
