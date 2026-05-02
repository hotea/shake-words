"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAdapter } from "@/lib/adapter";
import { wordBookManager } from "@/data/wordbooks";
import type { WordBook } from "@/lib/types";

import WordbookPreview from "@/components/Books/WordbookPreview";

type BookCategory = "all" | "cet" | "ielts" | "toefl" | "gre" | "business" | "tech" | "daily" | "custom" | "imported";

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
      await refreshBooks();
      
      // Load selected book from localStorage
      const adapter = getAdapter();
      if (adapter instanceof Object && 'getSelectedBookId' in adapter) {
        const saved = (adapter as any).getSelectedBookId?.();
        if (saved) setSelectedBookId(saved);
      }
      
      setLoading(false);
    }
    load();
  }, []);

  const refreshBooks = async () => {
    const adapter = getAdapter();
    const result = await adapter.getWordBooks();
    setBooks(result);
  };

  const handleSelectBook = async (bookId: string) => {
    // Check if it's an online book
    const book = books.find(b => b.id === bookId);
    
    if (book?.isOnline) {
      setLoadingOnline(bookId);
      try {
        // Pre-fetch the online book data
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
    const adapter = getAdapter();
    if (adapter instanceof Object && 'setSelectedBookId' in adapter) {
      (adapter as any).setSelectedBookId?.(bookId);
    }
  };

  const handleDeleteCustomBook = async (bookId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm("确定要删除这个自定义词书吗？")) {
      return;
    }

    wordBookManager.deleteCustomBook(bookId);
    await refreshBooks();
    
    if (selectedBookId === bookId) {
      setSelectedBookId(null);
    }
  };

  const handleExportBook = async (bookId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const json = await wordBookManager.exportToJSON(bookId);
      if (!json) {
        alert("导出失败");
        return;
      }

      // Download as file
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `shakewords-${bookId}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert("导出失败");
    }
  };

  const handleStartLearning = () => {
    if (selectedBookId) {
      router.push(`/quiz?book=${selectedBookId}`);
    }
  };



  // Filter books by category
  const filteredBooks = books.filter((book) => {
    if (activeCategory === "all") return true;
    return book.category === activeCategory;
  });

  // Get book icon based on ID/category
  const getBookIcon = (book: WordBook) => {
    if (book.id.includes("cet4")) return "📘";
    if (book.id.includes("cet6")) return "📗";
    if (book.id.includes("ielts")) return "📕";
    if (book.id.includes("toefl")) return "📙";
    if (book.id.includes("gre")) return "🎓";
    if (book.id.includes("business")) return "💼";
    if (book.id.includes("tech")) return "💻";
    if (book.id.includes("daily")) return "🗣️";
    if (book.isCustom) return "✨";
    return "📚";
  };

  // Get book color based on ID
  const getBookColor = (book: WordBook) => {
    if (book.id.includes("cet4")) return "from-blue-500 to-cyan-400";
    if (book.id.includes("cet6")) return "from-green-500 to-emerald-400";
    if (book.id.includes("ielts")) return "from-red-500 to-pink-400";
    if (book.id.includes("toefl")) return "from-orange-500 to-amber-400";
    if (book.id.includes("gre")) return "from-purple-500 to-violet-400";
    if (book.id.includes("business")) return "from-indigo-500 to-blue-400";
    if (book.id.includes("tech")) return "from-cyan-500 to-teal-400";
    if (book.id.includes("daily")) return "from-yellow-500 to-orange-400";
    if (book.isCustom) return "from-purple-500 to-pink-400";
    return "from-[var(--color-primary)] to-[var(--color-primary-light)]";
  };

  const categories: { id: BookCategory; label: string }[] = [
    { id: "all", label: "全部" },
    { id: "cet", label: "四六级" },
    { id: "ielts", label: "雅思" },
    { id: "toefl", label: "托福" },
    { id: "gre", label: "GRE" },
    { id: "business", label: "商务" },
    { id: "tech", label: "IT" },
    { id: "daily", label: "日常" },
    { id: "custom", label: "自定义" },
  ];

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[var(--color-background)]/80 backdrop-blur-md border-b border-[var(--color-border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)] bg-white border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:border-[var(--color-primary)]/30 transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-[var(--color-foreground)]">选择词书</h1>
                <p className="text-sm text-[var(--color-muted)]">选择一本词书开始学习</p>
              </div>
            </div>
            
            {selectedBookId && (
              <button
                onClick={handleStartLearning}
                className="btn-primary px-6 py-2.5 text-sm"
              >
                开始学习
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Category tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-white text-[var(--color-muted)] hover:text-[var(--color-foreground)] border border-[var(--color-border)]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredBooks.map((book) => {
              const isSelected = selectedBookId === book.id;
              const isLoading = loadingOnline === book.id;
              const isCustomOrOnline = book.isCustom || book.isOnline;
              
              return (
                <div
                  key={book.id}
                  onClick={() => !isLoading && handleSelectBook(book.id)}
                  className={`card p-5 cursor-pointer transition-all duration-200 relative group ${
                    isSelected 
                      ? "ring-2 ring-[var(--color-primary)] border-[var(--color-primary)]" 
                      : "hover:border-[var(--color-primary)]/30"
                  } ${isLoading ? "opacity-70" : ""}`}
                >
                  {/* Action buttons for custom/online books */}
                  {isCustomOrOnline && !isLoading && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      {book.isCustom && (
                        <>
                          <button
                            onClick={(e) => handleExportBook(book.id, e)}
                            className="p-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                            title="导出词书"
                          >
                            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => handleDeleteCustomBook(book.id, e)}
                            className="p-1.5 rounded-lg bg-white border border-gray-200 hover:bg-red-50 transition-colors"
                            title="删除词书"
                          >
                            <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-[var(--radius-md)] bg-gradient-to-br ${getBookColor(book)} flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}>
                      {isLoading ? (
                        <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                      ) : (
                        getBookIcon(book)
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="text-lg font-semibold text-[var(--color-foreground)] truncate">
                          {book.name}
                        </h2>
                        {isSelected && !isLoading && (
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-[var(--color-muted)] mt-1 line-clamp-2">
                        {book.description}
                      </p>

                      <div className="flex items-center gap-3 mt-3">
                        {book.wordCount > 0 && (
                          <>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)]">
                              {book.wordCount}
                            </span>
                            <span className="text-xs text-[var(--color-muted)]">词</span>
                          </>
                        )}
                        
                        {book.isBuiltin && (
                          <span className="ml-auto text-xs px-2.5 py-1 rounded-full bg-[var(--color-primary-dim)] text-[var(--color-primary-dark)] font-medium">
                            本地
                          </span>
                        )}
                        {book.isOnline && (
                          <span className="ml-auto text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 font-medium border border-blue-100">
                            在线
                          </span>
                        )}
                        {book.isCustom && (
                          <span className="ml-auto text-xs px-2.5 py-1 rounded-full bg-purple-50 text-purple-600 font-medium border border-purple-100">
                            自定义
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredBooks.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-[var(--color-muted)]/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[var(--color-muted)]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <p className="text-[var(--color-muted)]">该分类下暂无词书</p>
          </div>
        )}
      </div>

      {/* Preview modal */}
      {previewBook && (
        <WordbookPreview
          book={previewBook.book}
          words={previewBook.words}
          onClose={() => setPreviewBook(null)}
          onConfirm={() => {
            setSelectedBookId(previewBook.book.id);
            const adapter = getAdapter();
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
