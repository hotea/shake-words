"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAdapter } from "@/lib/adapter";
import { wordBookManager } from "@/data/wordbooks";
import type { WordBook } from "@/lib/types";

import WordbookPreview from "@/components/Books/WordbookPreview";

type BookCategory = "all" | "cet" | "ielts" | "toefl" | "gre" | "sat" | "business";

const CATEGORIES: { id: BookCategory; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "cet", label: "四六级/考研" },
  { id: "ielts", label: "雅思" },
  { id: "toefl", label: "托福" },
  { id: "gre", label: "GRE" },
  { id: "sat", label: "SAT" },
  { id: "business", label: "商务" },
];

function getBookIconType(book: WordBook): string {
  if (book.id.includes("cet") || book.id.includes("kaoyan")) return "cet";
  if (book.id.includes("gre")) return "gre";
  if (book.id.includes("ielts")) return "ielts";
  if (book.id.includes("toefl")) return "toefl";
  if (book.id.includes("sat")) return "sat";
  if (book.id.includes("business") || book.id.includes("bec")) return "business";
  return "default";
}

export default function BooksPage() {
  const router = useRouter();
  const [books, setBooks] = useState<WordBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<BookCategory>("all");
  const [loadingOnline, setLoadingOnline] = useState<string | null>(null);
  const [previewBook, setPreviewBook] = useState<{ book: WordBook; words: any[] } | null>(null);

  useEffect(() => {
    async function load() {
      try {
        await refreshBooks();
        const adapter = await getAdapter();
        const saved = (adapter as any).getSelectedBookId?.();
        if (saved) setSelectedBookId(saved);
      } catch (e) {
        console.error("Failed to load books:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const refreshBooks = async () => {
    const adapter = await getAdapter();
    const result = await adapter.getWordBooks();
    setBooks(result);
  };

  const handleSelectBook = async (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    if (book?.isOnline) {
      setLoadingOnline(bookId);
      try {
        const words = await wordBookManager.getWords(bookId);
        if (words.length > 0) {
          setPreviewBook({ book, words });
        } else {
          alert("获取词书失败，请稍后重试");
        }
      } catch (error) {
        console.error("Failed to fetch online book:", error);
        alert("获取词书失败，请检查网络连接");
      } finally {
        setLoadingOnline(null);
      }
      return;
    }
    setSelectedBookId(bookId);
    const adapter = await getAdapter();
    if (adapter instanceof Object && 'setSelectedBookId' in adapter) {
      (adapter as any).setSelectedBookId?.(bookId);
    }
  };

  const handleStartLearning = () => {
    if (selectedBookId) router.push(`/quiz?book=${selectedBookId}`);
  };

  const filteredBooks = books.filter((book) => {
    if (activeCategory === "all") return true;
    return book.category === activeCategory;
  });

  return (
    <main className="min-h-screen bg-[var(--color-background)] flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-[var(--color-surface)]/80 backdrop-blur-xl border-b border-[var(--color-border)]">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[var(--color-ink-700)] text-[var(--color-muted)] hover:text-[var(--color-gold)] transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </Link>
            <h1 className="text-lg font-semibold text-[var(--color-rice)]" style={{ fontFamily: "var(--font-display)" }}>选择词书</h1>
          </div>

          {selectedBookId && (
            <button
              onClick={handleStartLearning}
              className="btn-primary btn-sm"
            >
              开始学习
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          )}
        </div>
      </header>

      {/* Category pills */}
      <div className="sticky top-14 z-10 bg-[var(--color-background)]/90 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 pt-3 pb-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`cursor-pointer shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[var(--color-primary)] text-[var(--color-rice)] shadow-[var(--shadow-glow)]"
                      : "bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-gold)] border border-[var(--color-border)] hover:border-[var(--color-gold)]"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-3">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-7 h-7 border-[2.5px] border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin" />
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[var(--color-muted)] text-sm">该分类下暂无词书</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredBooks.map((book) => {
              const isSelected = selectedBookId === book.id;
              const isLoading = loadingOnline === book.id;

              return (
                <div
                  key={book.id}
                  onClick={() => !isLoading && handleSelectBook(book.id)}
                  className={`group relative cursor-pointer rounded-2xl transition-all duration-200 border ${
                    isSelected
                      ? "border-[var(--color-gold)] bg-[var(--color-gold-dim)] shadow-[var(--shadow-glow-gold)]"
                      : "border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-ink-700)] hover:shadow-[var(--shadow-glow-gold)] hover:border-[var(--color-gold)]"
                  } ${isLoading ? "opacity-60" : ""}`}
                >
                  <div className="p-4">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                      isSelected
                        ? "bg-[var(--color-primary)] text-[var(--color-rice)] shadow-[var(--shadow-glow)]"
                        : "bg-[var(--color-cinnabar-dim)] text-[var(--color-cinnabar)]"
                    }`}>
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                      ) : (
                        <BookIcon type={getBookIconType(book)} className="w-5 h-5" />
                      )}
                    </div>

                    {/* Name */}
                    <h2 className="text-sm font-semibold text-[var(--color-rice)] leading-snug" style={{ fontFamily: "var(--font-sans)" }}>
                      {book.name}
                    </h2>

                    {/* Word count */}
                    {book.wordCount > 0 && (
                      <p className="text-xs text-[var(--color-muted)] mt-1">
                        {book.wordCount.toLocaleString()} 词
                      </p>
                    )}

                    {/* Selected check */}
                    {isSelected && !isLoading && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[var(--color-gold)] flex items-center justify-center">
                        <svg className="w-3 h-3 text-[var(--color-ink-900)]" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Preview modal */}
      {previewBook && (
        <WordbookPreview
          book={previewBook.book}
          words={previewBook.words}
          onClose={() => setPreviewBook(null)}
          onConfirm={async () => {
            setSelectedBookId(previewBook.book.id);
            const adapter = await getAdapter();
            if (adapter instanceof Object && 'setSelectedBookId' in adapter) {
              (adapter as any).setSelectedBookId?.(previewBook.book.id);
            }
            setPreviewBook(null);
          }}
        />
      )}
    </main>
  );
}

function BookIcon({ type, className = "w-5 h-5" }: { type: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    cet: (
      <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    ielts: (
      <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    toefl: (
      <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.499 5.221 69.074 69.074 0 00-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
      </svg>
    ),
    gre: (
      <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.499 5.221 69.074 69.074 0 00-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    sat: (
      <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    business: (
      <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
      </svg>
    ),
    default: (
      <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  };

  return <>{icons[type] || icons.default}</>;
}
