"use client";

import { useState, useEffect, useCallback } from "react";
import type { VocabItem } from "@/data/vocabulary";
import { apiGet } from "@/lib/api";
import { shuffle } from "@/lib/shuffle";

interface ApiVocabItem {
  id: string;
  word: string;
  romanization: string;
  meaning: string;
  level: number;
  example: string;
  exampleMeaning: string;
  topic: { id: string; name: string };
}

function adaptVocabItem(item: ApiVocabItem): VocabItem {
  return {
    id: item.id,
    word: item.word,
    romanization: item.romanization,
    meaning: item.meaning,
    level: item.level,
    example: item.example,
    exampleMeaning: item.exampleMeaning,
    topic: item.topic.name,
  };
}

export default function GamesPage() {
  const [activeTab, setActiveTab] = useState<"flashcard" | "quiz">("flashcard");
  const [vocabData, setVocabData] = useState<VocabItem[]>([]);
  const [vocabLoading, setVocabLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchVocab() {
      setVocabLoading(true);
      try {
        const res = await apiGet<ApiVocabItem[]>("/vocabulary", { limit: "100" });
        if (cancelled) return;
        if (res.success && res.data) {
          setVocabData(res.data.map(adaptVocabItem));
        }
      } catch {
        // Fail gracefully
      } finally {
        if (!cancelled) setVocabLoading(false);
      }
    }

    fetchVocab();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-24">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant/60 font-label mb-2">Học vui</p>
        <h1 className="font-headline font-extrabold text-5xl text-on-surface tracking-tight">
          Luyện tập ngôn ngữ.
        </h1>
        <p className="mt-3 text-on-surface-variant max-w-lg font-body">
          Chọn hình thức luyện tập phù hợp và chinh phục từ vựng mỗi ngày.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 mb-8 bg-surface-container rounded-2xl p-1.5 w-fit">
        {(["flashcard", "quiz"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setActiveTab(mode)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === mode
                ? "bg-surface-container-lowest text-on-surface shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {mode === "flashcard" ? "style" : "quiz"}
            </span>
            {mode === "flashcard" ? "Flashcard" : "Kiểm tra nhanh"}
          </button>
        ))}
      </div>

      {/* Game Area */}
      <div className="animate-[fade-in_0.3s_ease-out_both]" key={activeTab}>
        {vocabLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <span className="material-symbols-outlined text-4xl text-primary animate-spin block mb-3">progress_activity</span>
              <p className="text-sm text-on-surface-variant">Đang tải...</p>
            </div>
          </div>
        ) : activeTab === "flashcard" ? (
          <FlashcardGame vocabulary={vocabData} />
        ) : (
          <QuizGame vocabulary={vocabData} />
        )}
      </div>

      {/* Gamification Stats */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: "local_fire_department", label: "Chuỗi học", value: "15 ngày", desc: "Duy trì để mở khóa phần thưởng" },
          { icon: "leaderboard", label: "Xếp hạng", value: "#4", desc: "Top Hán tự nâng cao tuần này" },
          { icon: "gps_fixed", label: "Mục tiêu hôm nay", value: "3 bộ nữa", desc: "Hoàn thành 50 từ mỗi ngày" },
        ].map((item) => (
          <div key={item.label} className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary-container/50 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary text-xl">{item.icon}</span>
            </div>
            <div>
              <p className="font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant/60">{item.label}</p>
              <p className="font-headline font-bold text-lg text-on-surface mt-0.5">{item.value}</p>
              <p className="text-xs text-on-surface-variant mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FlashcardGame({ vocabulary }: { vocabulary: VocabItem[] }) {
  const [deck, setDeck] = useState(vocabulary);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);

  // Shuffle only on client after mount to avoid hydration mismatch
  useEffect(() => {
    setDeck(shuffle(vocabulary));
    setIndex(0);
  }, [vocabulary]);

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

  const card = deck[index];

  if (!card) {
    return (
      <div className="text-center py-20 text-on-surface-variant text-sm">
        Không có từ vựng nào để luyện tập.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-on-surface-variant mb-6">
        <span>
          {index + 1} / {deck.length}
        </span>
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
          <div
            className={`preserve-3d relative h-64 transition-transform duration-500 ${
              flipped ? "rotate-y-180" : ""
            }`}
          >
            {/* Front */}
            <div className="backface-hidden absolute inset-0 bg-surface-container-lowest rounded-2xl shadow-md flex flex-col items-center justify-center p-8">
              <p className="font-headline font-extrabold text-6xl text-primary">
                {card.word}
              </p>
              <p className="text-on-surface-variant mt-2">{card.romanization}</p>
              <p className="text-xs text-on-surface-variant/60 mt-8 animate-pulse">Nhấn để xem nghĩa</p>
            </div>

            {/* Back */}
            <div className="backface-hidden rotate-y-180 absolute inset-0 bg-primary-container rounded-2xl shadow-md flex flex-col items-center justify-center p-8">
              <p className="font-headline font-bold text-3xl text-on-primary-container">
                {card.meaning}
              </p>
              <div className="mt-4 text-center">
                <p className="text-sm text-on-primary-container/80">{card.example}</p>
                <p className="text-xs text-on-primary-container/60 mt-1 italic">
                  {card.exampleMeaning}
                </p>
              </div>
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

interface QuizQuestion {
  word: string;
  correct: string;
  choices: string[];
}

function buildQuestions(vocabList: VocabItem[]): QuizQuestion[] {
  return shuffle(vocabList)
    .slice(0, 10)
    .map((v) => {
      const wrongs = shuffle(vocabList.filter((x) => x.id !== v.id))
        .slice(0, 3)
        .map((x) => x.meaning);
      return {
        word: v.word,
        correct: v.meaning,
        choices: shuffle([v.meaning, ...wrongs]),
      };
    });
}

function QuizGame({ vocabulary }: { vocabulary: VocabItem[] }) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  // Build questions only on client after mount
  useEffect(() => {
    if (vocabulary.length > 0) {
      setQuestions(buildQuestions(vocabulary));
    }
  }, [vocabulary]);

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

  if (done) {
    const feedbackColor =
      score >= 8
        ? "text-primary"
        : score >= 5
        ? "text-on-surface"
        : "text-on-surface-variant";

    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm mb-6">
          <p className="animate-bounce-in font-headline font-extrabold text-6xl text-primary">{score}</p>
          <p className="text-on-surface-variant mt-2">/{questions.length} câu đúng</p>
          <p className={`text-2xl font-headline font-bold mt-4 ${feedbackColor}`}>
            {score >= 8 ? "Xuất sắc!" : score >= 5 ? "Tốt lắm!" : "Cố gắng thêm nhé!"}
          </p>
        </div>
        <button
          onClick={() => {
            setQuestions(buildQuestions(vocabulary));
            setQIndex(0);
            setSelected(null);
            setScore(0);
            setDone(false);
          }}
          className="mt-2 bg-primary-container text-on-primary-container font-bold px-8 py-3 rounded-full hover:opacity-90 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          Chơi lại
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div className="text-center py-20 text-on-surface-variant text-sm">Đang tải...</div>;
  }

  const q = questions[qIndex];

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-on-surface-variant mb-3">
        <span>Câu {qIndex + 1} / {questions.length}</span>
        <span>Điểm: {score}</span>
      </div>
      <div className="h-2 bg-surface-container rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${((qIndex) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="bg-surface-container-lowest rounded-2xl p-8 text-center shadow-sm mb-6">
        <p className="text-sm text-on-surface-variant mb-3">&ldquo;Nghĩa của từ này là gì?&rdquo;</p>
        <p className="font-headline font-extrabold text-5xl text-primary">{q.word}</p>
      </div>

      {/* Choices */}
      <div className="stagger-quiz grid grid-cols-2 gap-3">
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
              className={`animate-[fade-in-up_0.3s_ease-out_both] p-4 rounded-xl text-sm font-semibold text-left transition-colors duration-200 cursor-pointer active:scale-95 disabled:cursor-default disabled:active:scale-100 ${color}`}
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
