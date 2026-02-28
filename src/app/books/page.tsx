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
      <div className="mb-8">
        <Link
          href="/"
          className="text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
        >
          &larr; Back
        </Link>
        <h1 className="text-3xl font-bold mt-4">Word Books</h1>
        <p className="text-[var(--color-muted)] mt-1">
          Choose a vocabulary list to start learning
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4">
          {books.map((book) => (
            <Link
              key={book.id}
              href={`/quiz?book=${book.id}`}
              className="block p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-hover)] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{book.name}</h2>
                  <p className="text-sm text-[var(--color-muted)] mt-0.5">
                    {book.description}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-[var(--color-primary)]">
                    {book.wordCount}
                  </span>
                  <p className="text-xs text-[var(--color-muted)]">words</p>
                </div>
              </div>
              {book.isBuiltin && (
                <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
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
