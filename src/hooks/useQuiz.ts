"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { getAdapter } from "@/lib/adapter";
import type { QuizQuestion, GestureDirection, AnswerPayload } from "@/lib/types";

export type QuizState = "loading" | "ready" | "answered" | "error";

interface UseQuizOptions {
  bookId: string;
  autoNext?: boolean;
  autoNextDelay?: number;
}

interface UseQuizReturn {
  question: QuizQuestion | null;
  state: QuizState;
  error: string | null;
  /** Currently highlighted direction (for visual feedback before confirm) */
  selectedDirection: GestureDirection | null;
  /** Whether the last answer was correct */
  isCorrect: boolean | null;
  /** Answer the current question with a direction */
  answer: (direction: GestureDirection) => void;
  /** Load next question */
  next: () => void;
  /** Questions answered in current session */
  sessionCount: number;
  /** Correct answers in current session */
  sessionCorrect: number;
}

export function useQuiz(options: UseQuizOptions): UseQuizReturn {
  const { bookId, autoNext = true, autoNextDelay = 1500 } = options;

  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [state, setState] = useState<QuizState>("loading");
  const [error, setError] = useState<string | null>(null);
  const [selectedDirection, setSelectedDirection] = useState<GestureDirection | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [sessionCount, setSessionCount] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);

  const questionStartTime = useRef<number>(0);
  const adapter = useRef(getAdapter());

  const loadQuestion = useCallback(async () => {
    try {
      setState("loading");
      setSelectedDirection(null);
      setIsCorrect(null);
      setError(null);

      const q = await adapter.current.getQuizQuestion(bookId);
      if (!q) {
        setError("No quiz questions available");
        setState("error");
        return;
      }

      setQuestion(q);
      setState("ready");
      questionStartTime.current = Date.now();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load question";
      setError(msg);
      setState("error");
    }
  }, [bookId]);

  const answer = useCallback(
    async (direction: GestureDirection) => {
      if (state !== "ready" || !question) return;

      const responseMs = Date.now() - questionStartTime.current;
      const option = question.options.find((o) => o.direction === direction);
      if (!option) return;

      const correct = option.isCorrect;
      setSelectedDirection(direction);
      setIsCorrect(correct);
      setState("answered");

      setSessionCount((c) => c + 1);
      if (correct) setSessionCorrect((c) => c + 1);

      // Submit to backend
      const payload: AnswerPayload = {
        wordId: question.word.id,
        bookId,
        selectedDirection: direction,
        isCorrect: correct,
        responseMs,
      };

      try {
        await adapter.current.submitAnswer(payload);
      } catch {
        // Don't block the quiz flow for backend errors
        console.error("Failed to submit answer");
      }

      // Auto-advance to next question
      if (autoNext) {
        setTimeout(() => {
          loadQuestion();
        }, autoNextDelay);
      }
    },
    [state, question, bookId, autoNext, autoNextDelay, loadQuestion],
  );

  // Load first question
  useEffect(() => {
    loadQuestion();
  }, [loadQuestion]);

  return {
    question,
    state,
    error,
    selectedDirection,
    isCorrect,
    answer,
    next: loadQuestion,
    sessionCount,
    sessionCorrect,
  };
}
