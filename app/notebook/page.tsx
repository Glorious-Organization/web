"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useNotebook } from "@/context/NotebookContext";
import LevelBadge from "@/components/ui/LevelBadge";
import PracticeSection from "@/components/ui/PracticeSection";

type Tab = "vocab" | "grammar" | "practice";

export default function NotebookPage() {
  const [tab, setTab] = useState<Tab>("vocab");
  const { notebook, removeVocab, removeGrammar } = useNotebook();

  const totalCount = notebook.vocab.length + notebook.grammar.length;

  const practiceCards = useMemo(() => {
    const vocabCards = notebook.vocab.map((v) => ({
      id: `v-${v.id}`,
      front: v.word,
      frontSub: v.romanization,
      back: v.meaning,
      backSub: v.example,
    }));
    const grammarCards = notebook.grammar.map((g) => ({
      id: `g-${g.id}`,
      front: g.pattern,
      frontSub: g.structure,
      back: g.name,
      backSub: g.meaning,
    }));
    return [...vocabCards, ...grammarCards];
  }, [notebook]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-headline font-extrabold text-5xl text-primary tracking-tight">
          Sổ tay
        </h1>
        <p className="mt-2 text-on-surface-variant">
          {totalCount > 0
            ? `${totalCount} mục đã lưu — từ vựng và ngữ pháp của bạn.`
            : "Từ vựng và ngữ pháp bạn đã lưu."}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-outline-variant/20 mb-10">
        {([
          { key: "vocab", icon: "translate", label: "Từ vựng", count: notebook.vocab.length },
          { key: "grammar", icon: "menu_book", label: "Ngữ pháp", count: notebook.grammar.length },
          { key: "practice", icon: "sports_esports", label: "Luyện tập", count: totalCount > 0 ? totalCount : null },
        ] as const).map(({ key, icon, label, count }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 -mb-px transition-all duration-200 cursor-pointer ${
              tab === key
                ? "text-primary border-primary"
                : "text-on-surface-variant border-transparent hover:text-on-surface hover:border-outline-variant"
            }`}
          >
            <span className="material-symbols-outlined text-base">{icon}</span>
            {label}
            {count !== null && (
              <span className="ml-0.5 text-xs opacity-60">{count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Vocab Tab */}
      {tab === "vocab" && (
        <>
          {notebook.vocab.length === 0 ? (
            <EmptyState
              icon="translate"
              message="Chưa có từ vựng nào được lưu."
              hint="Vào trang Từ vựng và nhấn icon bookmark để lưu."
              href="/vocabulary"
              cta="Đến trang Từ vựng"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {notebook.vocab.map((item) => (
                <div
                  key={item.id}
                  className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm group relative"
                >
                  <button
                    onClick={() => removeVocab(item.id)}
                    className="absolute top-4 right-4 p-1.5 rounded-full text-on-surface-variant/40 hover:text-error hover:bg-error-container/20 transition-colors duration-200 cursor-pointer opacity-60 sm:opacity-0 sm:group-hover:opacity-100"
                    aria-label="Xóa khỏi sổ tay"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>

                  {/* Part of speech / topic tag */}
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant/50 mb-2">
                    {item.topic || "Danh từ"}
                  </p>

                  {/* Korean word — large display */}
                  <p className="font-headline font-bold text-4xl text-on-surface">{item.word}</p>

                  {/* Romanization + meaning */}
                  <p className="text-sm text-on-surface-variant mt-1">
                    {item.romanization} • {item.meaning}
                  </p>

                  {/* Example in italic */}
                  {item.example && (
                    <p className="text-sm italic text-on-surface-variant/70 mt-3 leading-relaxed">
                      &ldquo;{item.example}&rdquo;
                    </p>
                  )}

                  {/* Level badge */}
                  <div className="mt-3">
                    <LevelBadge level={item.level} />
                  </div>
                </div>
              ))}

              {/* Inspiration Gallery card */}
              <div className="relative rounded-2xl overflow-hidden min-h-[200px] cursor-pointer group">
                <Image
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=70"
                  alt="Korean landscape"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="font-headline font-bold text-white text-lg">Inspiration Gallery</p>
                  <p className="text-white/70 text-xs mt-0.5">Hình ảnh cho hành trình học tập</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Practice Tab */}
      {tab === "practice" && (
        <div className="animate-[fade-in_0.25s_ease-out_both]">
          <PracticeSection
            cards={practiceCards}
            emptyMessage="Chưa có mục nào được lưu. Hãy lưu từ vựng hoặc ngữ pháp vào sổ tay trước."
          />
        </div>
      )}

      {/* Grammar Tab */}
      {tab === "grammar" && (
        <>
          {notebook.grammar.length === 0 ? (
            <EmptyState
              icon="menu_book"
              message="Chưa có ngữ pháp nào được lưu."
              hint="Vào trang Ngữ pháp và nhấn icon bookmark để lưu."
              href="/grammar"
              cta="Đến trang Ngữ pháp"
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {notebook.grammar.map((item) => (
                <div
                  key={item.id}
                  className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm group relative"
                >
                  <button
                    onClick={() => removeGrammar(item.id)}
                    className="absolute top-4 right-4 p-1.5 rounded-full text-on-surface-variant/40 hover:text-error hover:bg-error-container/20 transition-colors duration-200 cursor-pointer opacity-60 sm:opacity-0 sm:group-hover:opacity-100"
                    aria-label="Xóa khỏi sổ tay"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>

                  <div className="flex items-center gap-2 mb-2">
                    <LevelBadge level={item.level} />
                  </div>

                  {/* Pattern — plain text, no wrapper bg */}
                  <p className="font-headline font-extrabold text-2xl text-on-surface">
                    {item.pattern}
                  </p>

                  <p className="text-sm font-semibold text-on-surface mt-2">{item.name}</p>
                  <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                    {item.meaning}
                  </p>

                  {item.examples[0] && (
                    <div className="mt-3 p-3 bg-surface-container-low rounded-xl">
                      <p className="text-sm text-on-surface">{item.examples[0].korean}</p>
                      <p className="text-xs text-on-surface-variant mt-1 italic">
                        {item.examples[0].vietnamese}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function EmptyState({
  icon,
  message,
  hint,
  href,
  cta,
}: {
  icon: string;
  message: string;
  hint: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="text-center py-20">
      <span className="material-symbols-outlined text-6xl text-on-surface-variant/40 block mb-4">
        {icon}
      </span>
      <p className="text-on-surface font-medium">{message}</p>
      <p className="text-sm text-on-surface-variant mt-1">{hint}</p>
      <Link
        href={href}
        className="inline-block mt-6 bg-primary-container text-on-primary-container font-semibold px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity duration-200 cursor-pointer"
      >
        {cta}
      </Link>
    </div>
  );
}
