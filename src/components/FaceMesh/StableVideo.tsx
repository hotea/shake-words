"use client";

import { memo } from "react";

interface StableVideoProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  showCamera?: boolean;
  className?: string;
}

/**
 * 稳定的视频组件，不会因为父组件重新渲染而重新挂载 video 元素
 */
export const StableVideo = memo(function StableVideo({
  videoRef,
  showCamera = true,
  className = "",
}: StableVideoProps) {
  return (
    <video
      ref={videoRef}
      className={`w-full h-full object-cover scale-x-[-1] ${
        showCamera ? "" : "absolute inset-0 opacity-0 pointer-events-none"
      } ${className}`}
      playsInline
      muted
      // 不需要 autoPlay，由预加载 hook 控制
    />
  );
});
