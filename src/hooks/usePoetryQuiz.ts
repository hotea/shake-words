"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { getRandomPoem, type Poem } from "@/data/poems";
import type { GestureDirection } from "@/lib/types";

// ============================================================
// 诗词拼图 Hook — 支持逐字 / 逐句两种模式
// ============================================================

const DIRECTIONS: GestureDirection[] = ["up", "down", "left", "right"];

export type PoetryMode = "char" | "line";

/** 四向槽位 */
export interface PoetrySlot {
  direction: GestureDirection;
  /** 逐句模式：lineIndex；逐字模式：charIndex（全诗展平后的字符序号） */
  index: number;
  text: string;
  flying: boolean;
}

/** 已归位项 */
export interface PlacedItem {
  index: number;
  text: string;
}

export type PoetryPhase = "loading" | "playing" | "complete";

export interface UsePoetryQuizReturn {
  poem: Poem | null;
  phase: PoetryPhase;
  mode: PoetryMode;
  slots: PoetrySlot[];
  placed: PlacedItem[];
  /** 逐句模式：当前目标行号；逐字模式：当前目标字符序号 */
  targetIndex: number;
  selectedDirection: GestureDirection | null;
  lastCorrect: boolean | null;
  select: (direction: GestureDirection) => void;
  nextPoem: () => void;
  switchMode: (mode: PoetryMode) => void;
  completedCount: number;
  errorCount: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 将诗展平为字符列表 */
function flattenChars(poem: Poem): string[] {
  return poem.lines.join("").split("");
}

/** 逐字模式：从全诗字符中选取替补字符 */
function pickCharReplacement(
  allChars: string[],
  targetIndex: number,
  placedSet: Set<number>,
  currentSlotIndices: number[],
): number | null {
  // 优先：未归位且不在当前槽位
  const unplaced = allChars
    .map((_, i) => i)
    .filter((i) => i !== targetIndex && !placedSet.has(i) && !currentSlotIndices.includes(i));
  if (unplaced.length > 0) return shuffle(unplaced)[0];

  // 备选：已归位但不在槽位
  const placedArr = allChars
    .map((_, i) => i)
    .filter((i) => placedSet.has(i) && !currentSlotIndices.includes(i));
  if (placedArr.length > 0) return shuffle(placedArr)[0];

  // 再备选：任何不在槽位的
  const anyOther = allChars
    .map((_, i) => i)
    .filter((i) => !currentSlotIndices.includes(i));
  return anyOther.length > 0 ? shuffle(anyOther)[0] : null;
}

/** 逐句模式：从行中选取替补行 */
function pickLineReplacement(
  poem: Poem,
  targetIndex: number,
  placedSet: Set<number>,
  currentSlotIndices: number[],
): number | null {
  const unplaced = poem.lines
    .map((_, i) => i)
    .filter((i) => i !== targetIndex && !placedSet.has(i) && !currentSlotIndices.includes(i));
  if (unplaced.length > 0) return shuffle(unplaced)[0];

  const placedArr = poem.lines
    .map((_, i) => i)
    .filter((i) => placedSet.has(i) && !currentSlotIndices.includes(i));
  if (placedArr.length > 0) return shuffle(placedArr)[0];

  const anyOther = poem.lines
    .map((_, i) => i)
    .filter((i) => !currentSlotIndices.includes(i));
  return anyOther.length > 0 ? shuffle(anyOther)[0] : null;
}

/** 构建初始 4 个槽位 */
function buildSlots(
  mode: PoetryMode,
  poem: Poem,
  targetIndex: number,
  placedSet: Set<number>,
): PoetrySlot[] {
  if (mode === "char") {
    const allChars = flattenChars(poem);
    const mustInclude = targetIndex;
    const others = shuffle(
      allChars.map((_, i) => i).filter((i) => i !== mustInclude && !placedSet.has(i)),
    ).slice(0, 3);
    // 如果不够 3 个，从已归位中补
    if (others.length < 3) {
      const more = shuffle(
        allChars.map((_, i) => i).filter((i) => i !== mustInclude && !others.includes(i)),
      );
      while (others.length < 3 && more.length > 0) others.push(more.shift()!);
    }
    const indices = shuffle([mustInclude, ...others.slice(0, 3)]);
    return DIRECTIONS.map((dir, i) => ({
      direction: dir,
      index: indices[i],
      text: allChars[indices[i]],
      flying: false,
    }));
  } else {
    const mustInclude = targetIndex;
    const others = shuffle(
      poem.lines.map((_, i) => i).filter((i) => i !== mustInclude && !placedSet.has(i)),
    ).slice(0, 3);
    if (others.length < 3) {
      const more = shuffle(
        poem.lines.map((_, i) => i).filter((i) => i !== mustInclude && !others.includes(i)),
      );
      while (others.length < 3 && more.length > 0) others.push(more.shift()!);
    }
    const indices = shuffle([mustInclude, ...others.slice(0, 3)]);
    return DIRECTIONS.map((dir, i) => ({
      direction: dir,
      index: indices[i],
      text: poem.lines[indices[i]],
      flying: false,
    }));
  }
}

export function usePoetryQuiz(): UsePoetryQuizReturn {
  const [poem, setPoem] = useState<Poem | null>(null);
  const [phase, setPhase] = useState<PoetryPhase>("loading");
  const [mode, setMode] = useState<PoetryMode>("char");
  const [slots, setSlots] = useState<PoetrySlot[]>([]);
  const [placed, setPlaced] = useState<PlacedItem[]>([]);
  const [targetIndex, setTargetIndex] = useState(0);
  const [selectedDirection, setSelectedDirection] = useState<GestureDirection | null>(null);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);

  const excludeRef = useRef<string[]>([]);
  const answeringRef = useRef(false);
  const poemRef = useRef<Poem | null>(null);
  const placedRef = useRef<PlacedItem[]>([]);
  const targetIndexRef = useRef(0);
  const slotsRef = useRef<PoetrySlot[]>([]);
  const phaseRef = useRef<PoetryPhase>("loading");
  const modeRef = useRef<PoetryMode>("char");

  useEffect(() => { poemRef.current = poem; }, [poem]);
  useEffect(() => { placedRef.current = placed; }, [placed]);
  useEffect(() => { targetIndexRef.current = targetIndex; }, [targetIndex]);
  useEffect(() => { slotsRef.current = slots; }, [slots]);
  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { modeRef.current = mode; }, [mode]);

  const getTotalItems = useCallback((p: Poem, m: PoetryMode) => {
    return m === "char" ? flattenChars(p).length : p.lines.length;
  }, []);

  const startPoem = useCallback((p: Poem, currentMode: PoetryMode = modeRef.current) => {
    setPoem(p);
    poemRef.current = p;
    setPlaced([]);
    placedRef.current = [];
    setTargetIndex(0);
    targetIndexRef.current = 0;
    setSelectedDirection(null);
    setLastCorrect(null);
    setPhase("playing");
    phaseRef.current = "playing";

    const initialSlots = buildSlots(currentMode, p, 0, new Set());
    setSlots(initialSlots);
    slotsRef.current = initialSlots;
  }, []);

  useEffect(() => {
    const p = getRandomPoem();
    startPoem(p);
  }, [startPoem]);

  const select = useCallback(
    (direction: GestureDirection) => {
      if (phaseRef.current !== "playing" || !poemRef.current || answeringRef.current) return;
      answeringRef.current = true;

      const currentSlots = slotsRef.current;
      const slot = currentSlots.find((s) => s.direction === direction);
      if (!slot) { answeringRef.current = false; return; }

      const currentTarget = targetIndexRef.current;
      const correct = slot.index === currentTarget;
      setSelectedDirection(direction);
      setLastCorrect(correct);

      if (correct) {
        const p = poemRef.current!;
        const m = modeRef.current;

        // 1. 标记飞出
        const flySlots = currentSlots.map((s) =>
          s.direction === direction ? { ...s, flying: true } : s,
        );
        setSlots(flySlots);
        slotsRef.current = flySlots;

        // 2. 归位
        const newPlaced: PlacedItem = { index: currentTarget, text: slot.text };
        const nextPlaced = [...placedRef.current, newPlaced];
        setPlaced(nextPlaced);
        placedRef.current = nextPlaced;

        const nextTarget = currentTarget + 1;
        const total = getTotalItems(p, m);

        if (nextTarget >= total) {
          setTimeout(() => {
            setPhase("complete");
            phaseRef.current = "complete";
            setCompletedCount((c) => c + 1);
            setSelectedDirection(null);
            setLastCorrect(null);
            answeringRef.current = false;
          }, 400);
          return;
        }

        // 3. 延迟后替换飞出的卡片并重排方向，防止正确答案总在同一方向
        setTimeout(() => {
          setTargetIndex(nextTarget);
          targetIndexRef.current = nextTarget;

          const placedSet = new Set(nextPlaced.map((p) => p.index));
          const remaining = total - nextPlaced.length; // 剩余未归位数（含新 target）

          // 收集保留的卡片（非飞出的）
          const keptItems: { index: number; text: string }[] = [];
          for (const s of flySlots) {
            if (!s.flying) {
              keptItems.push({ index: s.index, text: s.text });
            }
          }

          // 判断是否需要补位：剩余未归位数 > 3 才补（否则卡片只会越来越少）
          if (remaining <= 3) {
            // 不补位，只保留未飞出的卡片
            const shuffledDirs = shuffle(DIRECTIONS.slice(0, keptItems.length));
            const newSlots: PoetrySlot[] = keptItems.map((item, i) => ({
              direction: shuffledDirs[i],
              index: item.index,
              text: item.text,
              flying: false,
            }));

            // 确保 target 在其中
            if (!newSlots.some((s) => s.index === nextTarget)) {
              const replaceIdx = newSlots.findIndex((s) => s.index !== nextTarget);
              if (replaceIdx >= 0) {
                const text = m === "char" ? flattenChars(p)[nextTarget] : p.lines[nextTarget];
                newSlots[replaceIdx] = { ...newSlots[replaceIdx], index: nextTarget, text };
              }
            }

            setSlots(newSlots);
            slotsRef.current = newSlots;
          } else {
            // 需要补位
            const currentSlotIndices = keptItems.map((it) => it.index);
            const targetAlreadyInSlots = currentSlotIndices.includes(nextTarget);

            let replacement: number | null;
            if (m === "char") {
              replacement = targetAlreadyInSlots
                ? pickCharReplacement(flattenChars(p), nextTarget, placedSet, currentSlotIndices)
                : nextTarget;
            } else {
              replacement = targetAlreadyInSlots
                ? pickLineReplacement(p, nextTarget, placedSet, currentSlotIndices)
                : nextTarget;
            }

            const repIdx = replacement !== null ? replacement : nextTarget;
            const repText = m === "char" ? flattenChars(p)[repIdx] : p.lines[repIdx];
            const items = [...keptItems, { index: repIdx, text: repText }];

            // 双重保障：确保 target 在 items 中
            if (!items.some((it) => it.index === nextTarget)) {
              const replaceItemIdx = items.findIndex((it) => it.index !== nextTarget);
              if (replaceItemIdx >= 0) {
                const text = m === "char" ? flattenChars(p)[nextTarget] : p.lines[nextTarget];
                items[replaceItemIdx] = { index: nextTarget, text };
              }
            }

            // 随机重排方向
            const shuffledDirs = shuffle([...DIRECTIONS]);
            const newSlots: PoetrySlot[] = items.map((item, i) => ({
              direction: shuffledDirs[i],
              index: item.index,
              text: item.text,
              flying: false,
            }));

            setSlots(newSlots);
            slotsRef.current = newSlots;
          }

          setSelectedDirection(null);
          setLastCorrect(null);
          answeringRef.current = false;
        }, 400);
      } else {
        setErrorCount((c) => c + 1);
        setTimeout(() => {
          setSelectedDirection(null);
          setLastCorrect(null);
          answeringRef.current = false;
        }, 400);
      }
    },
    [getTotalItems],
  );

  const nextPoem = useCallback(() => {
    if (poemRef.current) {
      excludeRef.current.push(poemRef.current.id);
      if (excludeRef.current.length > 10) excludeRef.current = excludeRef.current.slice(-10);
    }
    const p = getRandomPoem(excludeRef.current);
    startPoem(p);
  }, [startPoem]);

  const switchMode = useCallback((newMode: PoetryMode) => {
    setMode(newMode);
    modeRef.current = newMode;
    // 重新开始当前诗
    if (poemRef.current) startPoem(poemRef.current, newMode);
  }, [startPoem]);

  return {
    poem, phase, mode, slots, placed, targetIndex,
    selectedDirection, lastCorrect,
    select, nextPoem, switchMode,
    completedCount, errorCount,
  };
}
