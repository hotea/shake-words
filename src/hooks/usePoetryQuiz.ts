"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { getRandomPoem, flattenChars, type Poem } from "@/data/poems";
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

/** 逐字模式：从全诗字符中选取替补字符（排除与目标同字的项，避免用户困惑） */
function pickCharReplacement(
  allChars: string[],
  targetIndex: number,
  targetText: string,
  placedSet: Set<number>,
  currentSlotIndices: number[],
): number | null {
  const unplaced = allChars
    .map((_, i) => i)
    .filter((i) => i !== targetIndex && !placedSet.has(i) && !currentSlotIndices.includes(i) && allChars[i] !== targetText);
  return unplaced.length > 0 ? shuffle(unplaced)[0] : null;
}

/** 逐句模式：从行中选取替补行（不从已归位中补位，避免重复出现） */
function pickLineReplacement(
  poem: Poem,
  targetIndex: number,
  placedSet: Set<number>,
  currentSlotIndices: number[],
): number | null {
  const unplaced = poem.lines
    .map((_, i) => i)
    .filter((i) => i !== targetIndex && !placedSet.has(i) && !currentSlotIndices.includes(i));
  return unplaced.length > 0 ? shuffle(unplaced)[0] : null;
}

/** 构建初始槽位（最多 4 个，可能少于 4 个） */
function buildSlots(
  mode: PoetryMode,
  poem: Poem,
  targetIndex: number,
  placedSet: Set<number>,
): PoetrySlot[] {
  if (mode === "char") {
    const allChars = flattenChars(poem);
    const mustInclude = targetIndex;
    const targetText = allChars[targetIndex];
    // 排除与目标同字的项，避免用户看到两个相同字却只有一个是正确的
    const others = shuffle(
      allChars.map((_, i) => i).filter((i) => i !== mustInclude && !placedSet.has(i) && allChars[i] !== targetText),
    ).slice(0, 3);
    const indices = shuffle([mustInclude, ...others]);
    return indices.map((idx, i) => ({
      direction: DIRECTIONS[i],
      index: idx,
      text: allChars[idx],
      flying: false,
    }));
  } else {
    const mustInclude = targetIndex;
    const others = shuffle(
      poem.lines.map((_, i) => i).filter((i) => i !== mustInclude && !placedSet.has(i)),
    ).slice(0, 3);
    // 不从已归位中补位，槽位数可能少于 4
    const indices = shuffle([mustInclude, ...others]);
    return indices.map((idx, i) => ({
      direction: DIRECTIONS[i],
      index: idx,
      text: poem.lines[idx],
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
    setMode(currentMode);
    modeRef.current = currentMode;
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
          let keptItems: { index: number; text: string }[] = [];
          for (const s of flySlots) {
            if (!s.flying) {
              keptItems.push({ index: s.index, text: s.text });
            }
          }

          // 逐字模式：移除与新目标同字但不同 index 的保留项，避免出现两个相同字
          if (m === "char") {
            const allChars = flattenChars(p);
            const targetText = allChars[nextTarget];
            keptItems = keptItems.filter(item => allChars[item.index] !== targetText || item.index === nextTarget);
          }

          // 构建新的槽位列表
          let items: { index: number; text: string }[];

          if (remaining <= 3) {
            // 剩余少，不补位，卡片自然减少
            items = [...keptItems];
          } else {
            // 需要补位：检查目标是否已在保留项中
            const currentSlotIndices = keptItems.map((it) => it.index);
            const targetAlreadyInSlots = currentSlotIndices.includes(nextTarget);

            if (targetAlreadyInSlots) {
              // 目标已在槽位中，选一个干扰项补位
              let replacement: number | null;
              if (m === "char") {
                const allChars = flattenChars(p);
                replacement = pickCharReplacement(allChars, nextTarget, allChars[nextTarget], placedSet, currentSlotIndices);
              } else {
                replacement = pickLineReplacement(p, nextTarget, placedSet, currentSlotIndices);
              }
              if (replacement !== null) {
                const repText = m === "char" ? flattenChars(p)[replacement] : p.lines[replacement];
                items = [...keptItems, { index: replacement, text: repText }];
              } else {
                items = [...keptItems];
              }
            } else {
              // 目标不在槽位中，直接加入
              const targetText = m === "char" ? flattenChars(p)[nextTarget] : p.lines[nextTarget];
              items = [...keptItems, { index: nextTarget, text: targetText }];
            }
          }

          // 确保目标在 items 中
          if (!items.some((it) => it.index === nextTarget)) {
            const text = m === "char" ? flattenChars(p)[nextTarget] : p.lines[nextTarget];
            const replaceIdx = items.findIndex((it) => it.index !== nextTarget);
            if (replaceIdx >= 0) {
              items[replaceIdx] = { index: nextTarget, text };
            } else {
              items.push({ index: nextTarget, text });
            }
          }

          // 随机重排方向（支持可变槽位数）
          const shuffledDirs = shuffle(DIRECTIONS.slice(0, items.length));
          const newSlots: PoetrySlot[] = items.map((item, i) => ({
            direction: shuffledDirs[i],
            index: item.index,
            text: item.text,
            flying: false,
          }));

          setSlots(newSlots);
          slotsRef.current = newSlots;

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
