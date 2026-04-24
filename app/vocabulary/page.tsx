"use client";

import { useState, useMemo, useEffect } from "react";
import type { VocabItem } from "@/data/vocabulary";
import { apiGet } from "@/lib/api";
import LevelBadge from "@/components/ui/LevelBadge";
import MultiSelect from "@/components/ui/MultiSelect";
import { useNotebook } from "@/context/NotebookContext";
import PracticeSection from "@/components/ui/PracticeSection";

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

interface ApiTopic {
  id: string;
  name: string;
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

const LEVELS = [1, 2, 3, 4, 5, 6];

const LEVEL_OPTIONS = LEVELS.map((l) => ({
  value: String(l),
  label: `TOPIK ${l}`,
}));

export default function VocabularyPage() {
  const [tab, setTab] = useState<"learn" | "practice">("learn");
  const [search, setSearch] = useState("");
  const [levels, setLevels] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [vocabData, setVocabData] = useState<VocabItem[]>([]);
  const [topicOptions, setTopicOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const { saveVocab, removeVocab, isVocabSaved } = useNotebook();

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      try {
        const [vocabRes, topicsRes] = await Promise.all([
          apiGet<ApiVocabItem[]>("/vocabulary", { page: "1", limit: "100" }),
          apiGet<ApiTopic[]>("/vocabulary/topics"),
        ]);

        if (cancelled) return;

        if (vocabRes.success && vocabRes.data) {
          setVocabData(vocabRes.data.map(adaptVocabItem));
        }
        if (topicsRes.success && topicsRes.data) {
          setTopicOptions(
            topicsRes.data.map((t) => ({ value: t.name, label: t.name }))
          );
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
    return vocabData.filter((v) => {
      const matchSearch =
        search === "" ||
        v.word.includes(search) ||
        v.meaning.toLowerCase().includes(search.toLowerCase()) ||
        v.romanization.toLowerCase().includes(search.toLowerCase());
      const matchLevel = levels.length === 0 || levels.includes(String(v.level));
      const matchTopic = topics.length === 0 || topics.includes(v.topic);
      return matchSearch && matchLevel && matchTopic;
    });
  }, [search, levels, topics, vocabData]);

  const practiceCards = useMemo(() =>
    filtered.map((v) => ({
      id: v.id,
      front: v.word,
      frontSub: v.romanization,
      back: v.meaning,
      backSub: v.example,
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
      <div className="relative mb-8 overflow-hidden">
        <span className="absolute -right-4 -top-2 font-headline font-bold text-[120px] text-primary/[0.04] pointer-events-none select-none leading-none">단어</span>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="font-headline font-extrabold text-5xl text-on-surface tracking-tight">
            Từ vựng
          </h1>
          <span className="px-3 py-1 rounded-full bg-primary-container text-on-primary-container text-sm font-label font-semibold self-end mb-1.5">
            3.000+ từ
          </span>
        </div>
        <p className="mt-2 text-on-surface-variant max-w-lg">
          Khám phá kho từ vựng tiếng Hàn phân loại theo cấp độ TOPIK và chủ đề.
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
            emptyMessage="Không có từ vựng nào để luyện tập. Hãy điều chỉnh bộ lọc."
          />
        </div>
      )}

      {/* Learn tab content */}
      {tab === "learn" && <>

      {/* Search */}
      <div className="relative mb-6">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
          search
        </span>
        <input
          type="text"
          placeholder="Tìm từ tiếng Hàn, nghĩa, phiên âm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 outline-none text-on-surface placeholder:text-on-surface-variant/50 shadow-sm focus:shadow-md focus:ring-2 focus:ring-primary/20 transition-all duration-200 cursor-text"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-10">
        <MultiSelect
          values={levels}
          onValuesChange={setLevels}
          options={LEVEL_OPTIONS}
          icon="school"
          placeholder="Cấp độ"
        />
        <MultiSelect
          values={topics}
          onValuesChange={setTopics}
          options={topicOptions}
          icon="category"
          placeholder="Chủ đề"
          activeColor="tertiary"
        />
        {(levels.length > 0 || topics.length > 0) && (
          <button
            onClick={() => { setLevels([]); setTopics([]); }}
            className="flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-colors duration-200 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">close</span>
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-on-surface-variant mb-6">
        Hiển thị{" "}
        <span className="font-semibold text-on-surface">{filtered.length}</span>{" "}
        từ vựng
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => {
          const saved = isVocabSaved(item.id);
          return (
            <div
              key={item.id}
              className="card-shimmer bg-surface-container-lowest rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:bg-surface-container-low transition-all duration-200 group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-headline font-bold text-4xl text-primary">
                    {item.word}
                  </p>
                  <p className="text-sm text-on-surface-variant mt-0.5">
                    {item.romanization}
                  </p>
                </div>
                <button
                  onClick={() => (saved ? removeVocab(item.id) : saveVocab(item))}
                  className={`w-11 h-11 rounded-full cursor-pointer transition-colors duration-200 active:scale-95 flex items-center justify-center shrink-0 ${
                    saved
                      ? "text-primary bg-primary-container/40"
                      : "text-on-surface-variant hover:text-primary hover:bg-primary-container/30"
                  }`}
                  aria-label={saved ? "Bỏ lưu" : "Lưu vào sổ tay"}
                >
                  <span className="material-symbols-outlined text-xl">
                    {saved ? "bookmark" : "bookmark_border"}
                  </span>
                </button>
              </div>

              <p className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant/50 mt-3 mb-0.5">Nghĩa</p>
              <p className="font-semibold text-on-surface">{item.meaning}</p>

              <p className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant/50 mt-3 mb-0.5">Ví dụ</p>
              <div className="p-3 bg-surface-container-low rounded-xl">
                <p className="text-sm text-on-surface">{item.example}</p>
                <p className="text-xs text-on-surface-variant mt-1 italic">
                  {item.exampleMeaning}
                </p>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <LevelBadge level={item.level} />
                <span className="text-xs text-on-surface-variant">{item.topic}</span>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-20 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl block mb-3 opacity-50">
              search_off
            </span>
            <p className="text-sm">Không tìm thấy từ vựng phù hợp.</p>
          </div>
        )}
      </div>

      </> /* end learn tab */}
    </div>
  );
}
