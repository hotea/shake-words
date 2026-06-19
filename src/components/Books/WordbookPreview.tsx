"use client";

import { useState } from "react";
import type { Word, WordBook } from "@/lib/types";

interface WordbookPreviewProps {
  book: WordBook;
  words: Word[];
  onClose: () => void;
  onConfirm: () => void;
}

export default function WordbookPreview({
  book,
  words,
  onClose,
  onConfirm,
}: WordbookPreviewProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredWords = words.filter((word) =>
    word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
    word.meaning.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--color-ink-950)]/80 backdrop-blur-sm">
      <div className="bg-[var(--color-surface)] rounded-2xl shadow-[var(--shadow-xl)] border border-[var(--color-border)] w-full max-w-3xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[var(--color-border)]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-[var(--color-rice)]" style={{ fontFamily: "var(--font-display)" }}>{book.name}</h2>
              <p className="text-sm text-[var(--color-muted)] mt-1">{book.description}</p>
              <div className="flex items-center gap-3 mt-3">
                <span className="badge badge-primary">
                  {words.length} 个单词
                </span>
                {book.isCustom && (
                  <span className="badge badge-gold">
                    自定义
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[var(--color-ink-700)] transition-colors text-[var(--color-muted)] hover:text-[var(--color-rice)] cursor-pointer shrink-0"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-6 py-4 border-b border-[var(--color-border)]">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索单词或释义..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-muted)]"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Word list */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {filteredWords.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[var(--color-muted)]">没有找到匹配的单词</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredWords.map((word, index) => (
                <div
                  key={word.id}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-[var(--color-gold-dim)] transition-colors cursor-pointer border border-transparent hover:border-[var(--color-border)]"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-ink-700)] text-[var(--color-gold)] flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-[var(--color-rice)]">{word.word}</span>
                      {word.phonetic && (
                        <span className="text-sm text-[var(--color-muted)]">{word.phonetic}</span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--color-rice)]/90 mt-1">{word.meaning}</p>
                    {word.example && (
                      <p className="text-xs text-[var(--color-muted)] mt-1 italic">{word.example}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-ink-800)] rounded-b-2xl">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-[var(--color-muted)]">
              显示 {filteredWords.length} / {words.length} 个单词
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-5 h-10 rounded-lg border border-[var(--color-border)] text-[var(--color-rice)] hover:bg-[var(--color-ink-700)] transition-colors font-medium text-sm cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={onConfirm}
                className="px-5 h-10 rounded-lg bg-[var(--gradient-primary)] text-[var(--color-rice)] hover:opacity-90 transition-all font-medium shadow-[var(--shadow-glow)] text-sm cursor-pointer"
              >
                确认添加
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
