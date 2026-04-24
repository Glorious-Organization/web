"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { GrammarItem } from "@/data/grammar";
import { apiGet } from "@/lib/api";
import PracticeSection from "@/components/ui/PracticeSection";
import LevelBadge from "@/components/ui/LevelBadge";
import MultiSelect from "@/components/ui/MultiSelect";
import { useNotebook } from "@/context/NotebookContext";

interface ApiGrammarListItem {
  id: string;
  pattern: string;
  name: string;
  meaning: string;
  level: number;
}

function adaptGrammarListItem(item: ApiGrammarListItem): GrammarItem {
  return {
    id: item.id,
    pattern: item.pattern,
    name: item.name,
    meaning: item.meaning,
    level: item.level,
    structure: "",
    examples: [],
  };
}

const LEVEL_OPTIONS = [1, 2, 3, 4, 5, 6].map((l) => ({
  value: String(l),
  label: `TOPIK ${l}`,
}));

export default function GrammarPage() {
  const [tab, setTab] = useState<"learn" | "practice">("learn");
  const [search, setSearch] = useState("");
  const [levels, setLevels] = useState<string[]>([]);
  const [grammarData, setGrammarData] = useState<GrammarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { saveGrammar, removeGrammar, isGrammarSaved } = useNotebook();

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      try {
        const res = await apiGet<ApiGrammarListItem[]>("/grammar", { limit: "100" });
        if (cancelled) return;
        if (res.success && res.data) {
          setGrammarData(res.data.map(adaptGrammarListItem));
        }
      } catch {
        // Fail gracefully — keep empty data
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    return grammarData.filter((g) => {
      const matchSearch =
        search === "" ||
        g.pattern.includes(search) ||
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        g.meaning.toLowerCase().includes(search.toLowerCase());
      const matchLevel = levels.length === 0 || levels.includes(String(g.level));
      return matchSearch && matchLevel;
    });
  }, [search, levels, grammarData]);

  const practiceCards = useMemo(() =>
    filtered.map((g) => ({
      id: g.id,
      front: g.pattern,
      frontSub: g.structure,
      back: g.name,
      backSub: g.meaning,
    })),
    [filtered]
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-24">
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin block mb-3">progress_activity</span>
            <p className="text-sm text-on-surface-variant">Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-24">
      {/* Page glow accent */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary-container/20 blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="relative mb-10 overflow-hidden">
        <span className="absolute -right-2 top-0 font-headline font-bold text-[120px] text-primary/[0.04] pointer-events-none select-none leading-none">문법</span>
        <h1 className="font-headline font-extrabold text-5xl text-primary tracking-tight">
          Ngữ pháp
        </h1>
        <p className="mt-2 text-on-surface-variant max-w-lg">
          Cấu trúc ngữ pháp tiếng Hàn phân loại theo cấp độ TOPIK, có ví dụ và ghi chú chi tiết.
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex items-center gap-1 mb-8 border-b border-outline-variant/20">
        {([
          { key: "learn", icon: "menu_book", label: "Học" },
          { key: "practice", icon: "sports_esports", label: "Luyện tập" },
        ] as const).map(({ key, icon, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition-all duration-200 cursor-pointer ${
              tab === key
                ? "border-primary text-primary"
                : "border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline-variant"
            }`}
          >
            <span className="material-symbols-outlined text-base">{icon}</span>
            {label}
            {key === "practice" && filtered.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary-container text-on-primary-container text-[10px] font-bold">
                {filtered.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Practice tab */}
      {tab === "practice" && (
        <div className="animate-[fade-in_0.25s_ease-out_both]">
          <PracticeSection
            cards={practiceCards}
            emptyMessage="Không có ngữ pháp nào để luyện tập. Hãy điều chỉnh bộ lọc."
          />
        </div>
      )}

      {tab === "learn" && <>

      {/* Search + Filters */}
      <div className="relative mb-6">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl pointer-events-none">
          search
        </span>
        <input
          type="text"
          placeholder="Tìm cấu trúc ngữ pháp..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-full bg-surface-container-lowest border border-outline-variant/30 outline-none text-on-surface placeholder:text-on-surface-variant/50 shadow-sm focus:shadow-md focus:ring-2 focus:ring-primary/30 transition-all duration-200 cursor-text"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-10">
        <MultiSelect
          values={levels}
          onValuesChange={setLevels}
          options={LEVEL_OPTIONS}
          icon="school"
          placeholder="Cấp độ"
        />
        {levels.length > 0 && (
          <button
            onClick={() => setLevels([])}
            className="flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-colors duration-200 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">close</span>
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: Grammar Cards — 2/3 */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((item) => {
            const saved = isGrammarSaved(item.id);
            return (
              <div
                key={item.id}
                className="card-shimmer bg-surface-container-lowest rounded-2xl p-5 shadow-sm hover:shadow-md hover:bg-surface-container-low transition-all duration-200 relative"
              >
                <div className="flex items-start justify-between mb-2">
                  <LevelBadge level={item.level} />
                  <button
                    onClick={() => (saved ? removeGrammar(item.id) : saveGrammar(item))}
                    className={`w-11 h-11 rounded-full cursor-pointer transition-colors duration-200 active:scale-95 flex items-center justify-center shrink-0 ${
                      saved
                        ? "text-primary bg-primary-container/40"
                        : "text-on-surface-variant hover:text-primary hover:bg-primary-container/30"
                    }`}
                    aria-label={saved ? "Bỏ lưu" : "Lưu vào sổ tay"}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {saved ? "bookmark" : "bookmark_border"}
                    </span>
                  </button>
                </div>

                <p className="font-headline font-extrabold text-2xl text-primary mt-2">{item.pattern}</p>
                <p className="text-sm font-semibold text-on-surface mt-1.5">{item.name}</p>
                <p className="text-sm text-on-surface-variant mt-2 leading-relaxed line-clamp-2">
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

                <Link
                  href={`/grammar/${item.id}`}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary group transition-colors duration-200 cursor-pointer"
                >
                  <span className="group-hover:underline">Xem chi tiết</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </Link>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="col-span-2 text-center py-20 text-on-surface-variant">
              <span className="material-symbols-outlined text-5xl block mb-3 opacity-30">
                search_off
              </span>
              <p className="text-sm">Không tìm thấy ngữ pháp phù hợp.</p>
            </div>
          )}
        </div>

        {/* Right: Featured Deep Dive Card — 1/3, sticky */}
        <div className="lg:sticky lg:top-24">
          <div className="relative overflow-hidden bg-primary rounded-2xl p-7 flex flex-col justify-between shadow-md lg:min-h-[400px] cursor-pointer">
            {/* Background texture image */}
            <Image
              src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=600&q=60"
              alt=""
              fill
              className="object-cover opacity-10 mix-blend-overlay pointer-events-none"
            />
            {/* Decorative circles */}
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute -bottom-10 -left-6 w-32 h-32 rounded-full bg-white/[0.06] pointer-events-none" />

            <div className="relative">
              <span className="inline-block text-xs font-semibold bg-white/20 text-white px-3 py-1 rounded-full mb-4">
                Chuyên sâu
              </span>
              <h3 className="font-headline font-bold text-2xl text-on-primary leading-tight">
                Thành thạo Kính ngữ Hàn Quốc
              </h3>
              <p className="mt-3 text-on-primary/70 text-sm">
                Hệ thống kính ngữ (존댓말) là nền tảng giao tiếp trong văn hóa Hàn Quốc. Hiểu đúng để dùng đúng.
              </p>
            </div>
            <div className="relative mt-6">
              <p className="text-xs text-on-primary/50 mb-3">TOPIK 2 – 4 · 8 bài</p>
              <button className="w-full bg-surface-container-lowest text-primary font-bold py-3 rounded-full hover:opacity-90 active:scale-95 transition-all duration-200 cursor-pointer">
                Bắt đầu học
              </button>
            </div>
          </div>
        </div>
      </div>

      </> /* end learn tab */}
    </div>
  );
}
