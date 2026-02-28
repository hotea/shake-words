import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[var(--color-primary)]/[0.04] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-purple-500/[0.03] blur-[100px] pointer-events-none" />

      {/* Hero */}
      <div className="text-center mb-14 max-w-xl animate-fade-in">
        <h1 className="text-6xl sm:text-7xl font-bold mb-5 tracking-tight leading-[1.1]">
          Shake
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-hero)" }}>
            Words
          </span>
        </h1>
        <p className="text-lg text-[var(--color-muted)] leading-relaxed max-w-md mx-auto">
          Learn vocabulary by shaking your head.
          <br />
          Face Mesh tracks your movement to select answers.
        </p>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-14 max-w-2xl w-full">
        {[
          {
            step: "1",
            title: "Choose a word book",
            desc: "Pick from built-in lists like CET-4 or create your own",
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
            ),
          },
          {
            step: "2",
            title: "Enable your camera",
            desc: "Face Mesh tracks your head movements in real time",
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            ),
          },
          {
            step: "3",
            title: "Shake to answer",
            desc: "Tilt your head up/down/left/right to pick the correct meaning",
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5" />
              </svg>
            ),
          },
        ].map((item, i) => (
          <div
            key={item.step}
            className={`card p-6 text-center animate-fade-in-up stagger-${i + 1}`}
          >
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-dim)] text-[var(--color-primary-light)] flex items-center justify-center mx-auto mb-4">
              {item.icon}
            </div>
            <h3 className="font-semibold mb-1.5 text-[var(--color-foreground)]">{item.title}</h3>
            <p className="text-xs text-[var(--color-muted)] leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-5 animate-fade-in-up stagger-4">
        <Link href="/quiz" className="btn-primary text-lg px-10 py-3.5">
          Start Learning
        </Link>
        <div className="flex gap-6">
          {[
            { href: "/books", label: "Word Books" },
            { href: "/stats", label: "Stats" },
            { href: "/settings", label: "Settings" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-px after:bg-[var(--color-primary)] after:transition-all hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <p className="mt-20 text-xs text-[var(--color-muted)]/60 text-center max-w-sm animate-fade-in-up stagger-5">
        Keyboard fallback available (arrow keys / WASD).
        <br />
        Data stored locally by default. Sign in to sync across devices.
      </p>
    </main>
  );
}
