"use client";

import { useState, useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import { use } from "react";
import type { GrammarItem } from "@/data/grammar";
import { apiGet } from "@/lib/api";
import LevelBadge from "@/components/ui/LevelBadge";
import { useNotebook } from "@/context/NotebookContext";

interface ApiGrammarDetail extends Omit<GrammarItem, "relatedIds"> {
  relatedItems?: GrammarItem[];
}

function highlightText(text: string, word?: string) {
  if (!word) return <span>{text}</span>;
  const idx = text.indexOf(word);
  if (idx === -1) return <span>{text}</span>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-primary font-bold">{word}</span>
      {text.slice(idx + word.length)}
    </>
  );
}

export default function GrammarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { saveGrammar, removeGrammar, isGrammarSaved } = useNotebook();
  const [item, setItem] = useState<GrammarItem | null>(null);
  const [related, setRelated] = useState<GrammarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);
  const [expandedExamples, setExpandedExamples] = useState<Set<number>>(new Set());

  useEffect(() => {
    let cancelled = false;

    async function fetchDetail() {
      setLoading(true);
      try {
        const res = await apiGet<ApiGrammarDetail>(`/grammar/${id}`);
        if (cancelled) return;
        if (res.success && res.data) {
          const { relatedItems, ...grammarFields } = res.data;
          setItem(grammarFields);
          setRelated(relatedItems ?? []);
        } else {
          setNotFoundState(true);
        }
      } catch {
        setNotFoundState(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchDetail();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-28">
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin block mb-3">progress_activity</span>
            <p className="text-sm text-on-surface-variant">Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  if (notFoundState || !item) return notFound();

  const saved = isGrammarSaved(item.id);

  const toggleExample = (index: number) => {
    setExpandedExamples((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-28">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full bg-primary-container/20 blur-3xl pointer-events-none -z-10" />

      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors duration-200 cursor-pointer"
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Quay lại
      </button>

      {/* Hero header card */}
      <div className="relative overflow-hidden bg-primary-container/40 rounded-3xl px-7 py-8 mb-6 shadow-sm">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-primary/10 pointer-events-none" />
        <div className="absolute -bottom-6 -left-4 w-28 h-28 rounded-full bg-primary/[0.07] pointer-events-none" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <LevelBadge level={item.level} />
              <span className="text-xs font-semibold text-on-primary-container/60 uppercase tracking-wider">
                Ngữ pháp trung cấp
              </span>
            </div>
            <h1 className="font-headline font-extrabold text-4xl sm:text-5xl text-primary tracking-tight leading-tight">
              {item.fullPattern ?? item.pattern}
            </h1>
            <p className="mt-3 text-sm italic text-on-surface-variant">
              &ldquo;{item.meaning}&rdquo;
            </p>
          </div>
          <button
            onClick={() => (saved ? removeGrammar(item.id) : saveGrammar(item))}
            className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 active:scale-95 cursor-pointer ${
              saved
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-surface-container-lowest text-on-surface-variant hover:text-primary hover:bg-primary-container/50 border border-outline-variant/30"
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {saved ? "bookmark" : "bookmark_border"}
            </span>
            {saved ? "Đã lưu" : "Lưu"}
          </button>
        </div>
      </div>

      {/* Usage section */}
      {item.usagePoints && item.usagePoints.length > 0 && (
        <section className="mb-5">
          <h2 className="font-headline font-bold text-xl text-on-surface mb-4 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-primary inline-block" />
            Cách dùng (Usage)
          </h2>
          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
            {item.usagePoints.map((point, i) => (
              <div
                key={i}
                className={`flex items-start gap-4 px-5 py-4 ${
                  i !== 0 ? "border-t border-outline-variant/15" : ""
                }`}
              >
                <span className="material-symbols-outlined text-xl text-primary shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                <p className="text-sm text-on-surface leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Pattern table */}
      {item.patternRows && item.patternRows.length > 0 && (
        <section className="mb-5">
          <h2 className="font-headline font-bold text-xl text-on-surface mb-4 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-secondary inline-block" />
            Công thức (Pattern)
          </h2>
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                    Đối tượng
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                    Quy tắc
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                    Ví dụ
                  </th>
                </tr>
              </thead>
              <tbody>
                {item.patternRows.map((row, i) => (
                  <tr
                    key={i}
                    className="border-t border-outline-variant/20 hover:bg-surface-container-low/50 transition-colors duration-150"
                  >
                    <td className="px-4 py-3.5 font-semibold text-on-surface">
                      {row.subject}
                    </td>
                    <td className="px-4 py-3.5 text-primary font-medium">
                      {row.rule}
                    </td>
                    <td className="px-4 py-3.5 text-on-surface-variant">
                      <span className="text-on-surface">{row.exampleKorean}</span>
                      <span className="block text-xs mt-0.5">{row.exampleVietnamese}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Note */}
      {item.note && (
        <div className="mb-5 flex items-start gap-3 bg-error-container/20 border border-error-container/50 rounded-2xl px-5 py-4">
          <span className="material-symbols-outlined text-error mt-0.5 shrink-0">warning</span>
          <div>
            <p className="text-sm font-semibold text-error mb-0.5">Lưu ý</p>
            <p className="text-sm text-on-surface">{item.note}</p>
          </div>
        </div>
      )}

      {/* Examples */}
      <section className="mb-5">
        <h2 className="font-headline font-bold text-xl text-on-surface mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-tertiary inline-block" />
          Ví dụ (Examples)
        </h2>
        <div className="space-y-3">
          {item.examples.map((ex, i) => {
            const isExpanded = expandedExamples.has(i);
            return (
              <div
                key={i}
                className="bg-surface-container-lowest rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-all duration-200"
              >
                {/* Korean sentence */}
                <p className="text-base text-on-surface font-medium leading-relaxed">
                  {highlightText(ex.korean, ex.highlightWord)}
                </p>
                {/* Vietnamese always visible */}
                <p className="mt-1.5 text-sm text-on-surface-variant italic leading-relaxed">
                  {ex.vietnamese}
                </p>

                {/* Explanation on expand */}
                {ex.explanation && (
                  <>
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-outline-variant/20">
                        <p className="text-xs text-on-surface-variant leading-relaxed">
                          {ex.explanation}
                        </p>
                      </div>
                    )}
                    <button
                      onClick={() => toggleExample(i)}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary group cursor-pointer transition-colors duration-200"
                    >
                      <span className="group-hover:underline">
                        {isExpanded ? "Ẩn bớt" : "Xem chi tiết"}
                      </span>
                      <span
                        className={`material-symbols-outlined text-xs transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      >
                        expand_more
                      </span>
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison table */}
      {item.comparison && item.comparison.length > 0 && (
        <section className="mb-8">
          <h2 className="font-headline font-bold text-xl text-on-surface mb-4 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-primary-fixed-dim inline-block" />
            So sánh (Comparison)
          </h2>
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                    Cấu trúc
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                    Văn phong
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                    Mệnh lệnh
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                    Quá khứ
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                    Tương lai
                  </th>
                </tr>
              </thead>
              <tbody>
                {item.comparison.map((row, i) => (
                  <tr
                    key={i}
                    className="border-t border-outline-variant/20 hover:bg-surface-container-low/40 transition-colors duration-150"
                  >
                    <td className="px-4 py-3.5 font-semibold text-primary">{row.pattern}</td>
                    <td className="px-4 py-3.5 text-on-surface-variant">{row.register}</td>
                    <td className="px-4 py-3.5 text-center">
                      <ComparisonCell value={row.canImperative} />
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <ComparisonCell value={row.canPast} />
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <ComparisonCell value={row.canFuture} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="mb-8">
        <button className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary font-bold text-base py-4 rounded-2xl hover:bg-primary-dim active:scale-[0.98] transition-all duration-200 shadow-md cursor-pointer">
          <span className="material-symbols-outlined">rocket_launch</span>
          Bắt đầu Luyện tập nhanh
        </button>
      </div>

      {/* Related grammar */}
      {related.length > 0 && (
        <section>
          <h2 className="font-headline font-bold text-xl text-on-surface mb-4">
            Ngữ pháp liên quan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {related.map((rel) => (
              <button
                key={rel.id}
                onClick={() => router.push(`/grammar/${rel.id}`)}
                className="text-left bg-surface-container-lowest rounded-2xl p-4 shadow-sm hover:shadow-md hover:bg-surface-container-low transition-all duration-200 cursor-pointer active:scale-[0.98]"
              >
                <p className="font-headline font-bold text-lg text-primary">{rel.pattern}</p>
                <p className="text-xs text-on-surface-variant mt-1">{rel.name}</p>
                <p className="text-xs text-on-surface-variant/60 mt-1 line-clamp-2">{rel.meaning}</p>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ComparisonCell({ value }: { value: boolean | null }) {
  if (value === null) return <span className="text-on-surface-variant text-xs">—</span>;
  if (value) {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-container/50 text-primary">
        <span className="material-symbols-outlined text-sm">check</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center">
      <span className="text-xs font-semibold text-error">KHÔNG dùng</span>
    </span>
  );
}
