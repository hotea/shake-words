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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{book.name}</h2>
              <p className="text-sm text-gray-600 mt-1">{book.description}</p>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-sm px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">
                  {words.length} 个单词
                </span>
                {book.isCustom && (
                  <span className="text-sm px-3 py-1 rounded-full bg-purple-50 text-purple-700 font-medium">
                    自定义
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索单词或释义..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
        <div className="flex-1 overflow-y-auto p-6">
          {filteredWords.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">没有找到匹配的单词</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredWords.map((word, index) => (
                <div
                  key={word.id}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-gray-900">{word.word}</span>
                      {word.phonetic && (
                        <span className="text-sm text-gray-500">{word.phonetic}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{word.meaning}</p>
                    {word.example && (
                      <p className="text-xs text-gray-500 mt-1 italic">{word.example}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              显示 {filteredWords.length} / {words.length} 个单词
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={onConfirm}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all font-medium shadow-lg"
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
