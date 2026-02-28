"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdapter } from "@/lib/adapter";
import type { WordBook } from "@/lib/types";

export default function BooksPage() {
  const [books, setBooks] = useState<WordBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const adapter = getAdapter();
      const result = await adapter.getWordBooks();
      setBooks(result);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <main className="min-h-screen max-w-2xl mx-auto px-6 py-12">
      <div className="mb-10 animate-fade-in">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Back
        </Link>
        <h1 className="text-3xl font-bold mt-5">Word Books</h1>
        <p className="text-[var(--color-muted)] mt-1.5">
          Choose a vocabulary list to start learning
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4">
          {books.map((book, i) => (
            <Link
              key={book.id}
              href={`/quiz?book=${book.id}`}
              className={`card block p-6 hover:border-[var(--color-border-hover)] group animate-fade-in-up stagger-${Math.min(i + 1, 5)}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold group-hover:text-[var(--color-primary-light)] transition-colors">{book.name}</h2>
                  <p className="text-sm text-[var(--color-muted)] mt-1">
                    {book.description}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>
                    {book.wordCount}
                  </span>
                  <p className="text-xs text-[var(--color-muted)]">words</p>
                </div>
              </div>
              {book.isBuiltin && (
                <span className="inline-block mt-3 text-xs px-2.5 py-0.5 rounded-full bg-[var(--color-primary-dim)] text-[var(--color-primary-light)] font-medium">
                  Built-in
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
