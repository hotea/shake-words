import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      {/* Hero */}
      <div className="text-center mb-12 max-w-lg">
        <h1 className="text-5xl font-bold mb-4 tracking-tight">
          Shake<span className="text-[var(--color-primary)]">Words</span>
        </h1>
        <p className="text-lg text-[var(--color-muted)] leading-relaxed">
          Shake your head to learn vocabulary.
          <br />
          Face Mesh detects your head direction to select answers.
        </p>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-2xl w-full">
        {[
          {
            step: "1",
            title: "Choose a word book",
            desc: "Pick from built-in lists like CET-4 or create your own",
          },
          {
            step: "2",
            title: "Enable your camera",
            desc: "Face Mesh tracks your head movements in real time",
          },
          {
            step: "3",
            title: "Shake to answer",
            desc: "Tilt your head up/down/left/right to pick the correct meaning",
          },
        ].map((item) => (
          <div
            key={item.step}
            className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-center"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-bold mx-auto mb-3">
              {item.step}
            </div>
            <h3 className="font-semibold mb-1">{item.title}</h3>
            <p className="text-xs text-[var(--color-muted)]">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-3">
        <Link
          href="/quiz"
          className="px-8 py-3 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-white font-semibold text-lg transition-colors"
        >
          Start Learning
        </Link>
        <div className="flex gap-4">
          <Link
            href="/books"
            className="text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
          >
            Browse Word Books
          </Link>
          <Link
            href="/stats"
            className="text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
          >
            View Stats
          </Link>
          <Link
            href="/settings"
            className="text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
          >
            Settings
          </Link>
        </div>
      </div>

      {/* Footer note */}
      <p className="mt-16 text-xs text-[var(--color-muted)] text-center max-w-sm">
        Keyboard fallback available (arrow keys / WASD).
        <br />
        All data is stored locally in your browser.
      </p>
    </main>
  );
}
