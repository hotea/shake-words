export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--color-background)]">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]" />
        <p className="text-sm text-[var(--color-muted)]">加载中...</p>
      </div>
    </div>
  );
}
