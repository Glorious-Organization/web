"use client";

import { useState, useEffect, useCallback } from "react";
import { shuffle } from "@/lib/shuffle";

export interface PracticeCard {
  id: string;
  front: string;
  frontSub?: string;
  back: string;
  backSub?: string;
}

interface Props {
  cards: PracticeCard[];
  emptyMessage?: string;
}

export default function PracticeSection({ cards, emptyMessage = "Chưa có dữ liệu để luyện tập." }: Props) {
  const [mode, setMode] = useState<"flashcard" | "quiz">("flashcard");

  if (cards.length === 0) {
    return (
      <div className="text-center py-16 text-on-surface-variant">
        <span className="material-symbols-outlined text-5xl block mb-3 opacity-30">
          sports_esports
        </span>
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Mode switcher */}
      <div className="flex items-center gap-2 mb-8 bg-surface-container rounded-2xl p-1.5 w-fit">
        {(["flashcard", "quiz"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              mode === m
                ? "bg-surface-container-lowest text-on-surface shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {m === "flashcard" ? "style" : "quiz"}
            </span>
            {m === "flashcard" ? "Flashcard" : "Kiểm tra nhanh"}
          </button>
        ))}
      </div>

      <div key={mode} className="animate-[fade-in_0.25s_ease-out_both]">
        {mode === "flashcard"
          ? <FlashcardGame cards={cards} />
          : <QuizGame cards={cards} />
        }
      </div>
    </div>
  );
}

/* ── Flashcard ─────────────────────────────────────── */

function FlashcardGame({ cards }: { cards: PracticeCard[] }) {
  const [deck, setDeck] = useState<PracticeCard[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    setDeck(shuffle(cards));
    setIndex(0);
    setFlipped(false);
  }, [cards]);

  const next = useCallback(() => {
    setFlipped(false);
    setTimeout(() => setIndex((i) => (i + 1) % deck.length), 150);
  }, [deck.length]);

  const prev = () => {
    setFlipped(false);
    setTimeout(() => setIndex((i) => (i - 1 + deck.length) % deck.length), 150);
  };

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setTimeout(next, 3000);
    return () => clearTimeout(timer);
  }, [autoPlay, index, next]);

  if (deck.length === 0) return null;
  const card = deck[index];

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-on-surface-variant mb-6">
        <span>{index + 1} / {deck.length}</span>
        <button
          onClick={() => setAutoPlay((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 cursor-pointer ${
            autoPlay
              ? "bg-primary text-on-primary"
              : "bg-surface-container text-on-surface-variant hover:bg-primary-container/50"
          }`}
        >
          <span className="material-symbols-outlined text-sm">
            {autoPlay ? "pause" : "play_arrow"}
          </span>
          Auto-play
        </button>
      </div>

      {/* Card */}
      <div className="perspective-1000 mb-6">
        <button
          onClick={() => setFlipped((f) => !f)}
          className="w-full cursor-pointer"
          aria-label={flipped ? "Xem mặt trước" : "Xem mặt sau"}
        >
          <div className={`preserve-3d relative h-64 transition-transform duration-500 ${flipped ? "rotate-y-180" : ""}`}>
            {/* Front */}
            <div className="backface-hidden absolute inset-0 bg-surface-container-lowest rounded-2xl shadow-md flex flex-col items-center justify-center p-8">
              <p className="font-headline font-extrabold text-5xl text-primary text-center leading-tight">
                {card.front}
              </p>
              {card.frontSub && (
                <p className="text-on-surface-variant mt-2 text-sm">{card.frontSub}</p>
              )}
              <p className="text-xs text-on-surface-variant/60 mt-8 animate-pulse">Nhấn để xem nghĩa</p>
            </div>
            {/* Back */}
            <div className="backface-hidden rotate-y-180 absolute inset-0 bg-primary-container rounded-2xl shadow-md flex flex-col items-center justify-center p-8">
              <p className="font-headline font-bold text-3xl text-on-primary-container text-center leading-snug">
                {card.back}
              </p>
              {card.backSub && (
                <p className="text-sm text-on-primary-container/70 mt-3 text-center italic">{card.backSub}</p>
              )}
            </div>
          </div>
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={prev}
          className="w-11 h-11 rounded-full bg-surface-container hover:bg-surface-container-high active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0"
          aria-label="Thẻ trước"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <button
          onClick={() => setFlipped((f) => !f)}
          className="px-6 py-3 rounded-full bg-primary-container text-on-primary-container font-semibold hover:opacity-90 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          Lật thẻ
        </button>
        <button
          onClick={next}
          className="w-11 h-11 rounded-full bg-surface-container hover:bg-surface-container-high active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0"
          aria-label="Thẻ tiếp"
        >
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}

/* ── Quiz ──────────────────────────────────────────── */

interface QuizQuestion {
  front: string;
  correct: string;
  choices: string[];
}

function buildQuestions(cards: PracticeCard[]): QuizQuestion[] {
  const pool = shuffle(cards).slice(0, Math.min(10, cards.length));
  return pool.map((c) => {
    const wrongs = shuffle(cards.filter((x) => x.id !== c.id))
      .slice(0, 3)
      .map((x) => x.back);
    const choices = shuffle([c.back, ...wrongs]);
    return { front: c.front, correct: c.back, choices };
  });
}

function QuizGame({ cards }: { cards: PracticeCard[] }) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setQuestions(buildQuestions(cards));
  }, [cards]);

  function pick(choice: string) {
    if (selected) return;
    setSelected(choice);
    if (choice === questions[qIndex].correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (qIndex + 1 >= questions.length) {
        setDone(true);
      } else {
        setQIndex((i) => i + 1);
        setSelected(null);
      }
    }, 1000);
  }

  function restart() {
    setQuestions(buildQuestions(cards));
    setQIndex(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  }

  if (questions.length === 0) {
    return <div className="text-center py-20 text-on-surface-variant text-sm">Đang tải...</div>;
  }

  if (done) {
    const total = questions.length;
    const feedbackColor = score >= total * 0.8 ? "text-primary" : score >= total * 0.5 ? "text-on-surface" : "text-on-surface-variant";
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm mb-6">
          <p className="font-headline font-extrabold text-6xl text-primary">{score}</p>
          <p className="text-on-surface-variant mt-2">/{total} câu đúng</p>
          <p className={`text-2xl font-headline font-bold mt-4 ${feedbackColor}`}>
            {score >= total * 0.8 ? "Xuất sắc!" : score >= total * 0.5 ? "Tốt lắm!" : "Cố gắng thêm nhé!"}
          </p>
        </div>
        <button
          onClick={restart}
          className="bg-primary-container text-on-primary-container font-bold px-8 py-3 rounded-full hover:opacity-90 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          Chơi lại
        </button>
      </div>
    );
  }

  const q = questions[qIndex];

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-between text-sm text-on-surface-variant mb-3">
        <span>Câu {qIndex + 1} / {questions.length}</span>
        <span>Điểm: {score}</span>
      </div>
      <div className="h-2 bg-surface-container rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${(qIndex / questions.length) * 100}%` }}
        />
      </div>

      <div className="bg-surface-container-lowest rounded-2xl p-8 text-center shadow-sm mb-6">
        <p className="text-sm text-on-surface-variant mb-3">&ldquo;Nghĩa của từ này là gì?&rdquo;</p>
        <p className="font-headline font-extrabold text-5xl text-primary">{q.front}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {q.choices.map((c) => {
          const isCorrect = c === q.correct;
          const isSelected = c === selected;
          let color = "bg-surface-container-lowest hover:bg-primary-container/30 text-on-surface";
          if (selected) {
            if (isCorrect) color = "bg-primary-container text-on-primary-container";
            else if (isSelected) color = "bg-error-container text-on-error-container";
            else color = "bg-surface-container text-on-surface-variant";
          }
          return (
            <button
              key={c}
              onClick={() => pick(c)}
              disabled={!!selected}
              className={`p-4 rounded-xl text-sm font-semibold text-left transition-colors duration-200 cursor-pointer active:scale-95 disabled:cursor-default disabled:active:scale-100 ${color}`}
            >
              <span className="flex items-center gap-2">
                {selected && isCorrect && (
                  <span className="material-symbols-outlined text-base shrink-0">check_circle</span>
                )}
                {selected && isSelected && !isCorrect && (
                  <span className="material-symbols-outlined text-base shrink-0">cancel</span>
                )}
                {c}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
