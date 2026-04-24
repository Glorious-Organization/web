"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import type { VocabItem } from "@/data/vocabulary";
import type { GrammarItem } from "@/data/grammar";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import { apiGet, apiPost, apiDelete } from "@/lib/api";

interface NotebookState {
  vocab: VocabItem[];
  grammar: GrammarItem[];
}

interface NotebookContextValue {
  notebook: NotebookState;
  saveVocab: (item: VocabItem) => void;
  removeVocab: (id: string) => void;
  saveGrammar: (item: GrammarItem) => void;
  removeGrammar: (id: string) => void;
  isVocabSaved: (id: string) => boolean;
  isGrammarSaved: (id: string) => boolean;
}

interface ApiVocabItemWithTopic extends Omit<VocabItem, 'topic'> {
  topic: { id: string; name: string } | string;
}

interface NotebookVocabEntry {
  userId: string;
  vocabId?: string;
  savedAt: string;
  vocab?: ApiVocabItemWithTopic;
}

interface NotebookGrammarEntry {
  userId: string;
  grammarId?: string;
  savedAt: string;
  grammar?: GrammarItem;
}

interface NotebookApiResponse {
  vocab: NotebookVocabEntry[];
  grammar: NotebookGrammarEntry[];
}

function adaptVocabItem(raw: ApiVocabItemWithTopic): VocabItem {
  return {
    ...raw,
    topic: typeof raw.topic === 'string' ? raw.topic : raw.topic.name,
  };
}

const EMPTY_NOTEBOOK: NotebookState = { vocab: [], grammar: [] };

const NotebookContext = createContext<NotebookContextValue | null>(null);

export function NotebookProvider({ children }: { children: ReactNode }) {
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();
  const [notebook, setNotebook] = useState<NotebookState>(EMPTY_NOTEBOOK);
  const prevAuthRef = useRef(isAuthenticated);

  // Fetch notebook from API
  const fetchNotebook = useCallback(async () => {
    const res = await apiGet<NotebookApiResponse>("/notebook");
    if (res.success && res.data) {
      const vocab = res.data.vocab
        .map((entry) => entry.vocab)
        .filter((v): v is ApiVocabItemWithTopic => v != null)
        .map(adaptVocabItem);
      const grammar = res.data.grammar
        .map((entry) => entry.grammar)
        .filter((g): g is GrammarItem => g != null);
      setNotebook({ vocab, grammar });
    }
  }, []);

  // Fetch on mount when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotebook();
    }
  }, [isAuthenticated, fetchNotebook]);

  // Handle auth state transitions
  useEffect(() => {
    const wasAuthenticated = prevAuthRef.current;
    prevAuthRef.current = isAuthenticated;

    if (wasAuthenticated && !isAuthenticated) {
      // Logged out — clear notebook
      setNotebook(EMPTY_NOTEBOOK);
    }
    // Logged in case is handled by the fetch effect above
  }, [isAuthenticated]);

  const saveVocab = useCallback(
    (item: VocabItem) => {
      // Optimistic update
      setNotebook((prev) => {
        if (prev.vocab.some((v) => v.id === item.id)) return prev;
        return { ...prev, vocab: [item, ...prev.vocab] };
      });
      showToast("Đã lưu vào sổ tay", "success", "bookmark");

      if (isAuthenticated) {
        apiPost(`/notebook/vocab/${item.id}`).then((res) => {
          if (!res.success) {
            // Revert on failure
            setNotebook((prev) => ({
              ...prev,
              vocab: prev.vocab.filter((v) => v.id !== item.id),
            }));
            showToast("Lưu thất bại, vui lòng thử lại", "error");
          }
        });
      }
    },
    [isAuthenticated, showToast],
  );

  const removeVocab = useCallback(
    (id: string) => {
      const removedItem = notebook.vocab.find((v) => v.id === id);
      setNotebook((prev) => ({
        ...prev,
        vocab: prev.vocab.filter((v) => v.id !== id),
      }));
      showToast("Đã xóa khỏi sổ tay", "info", "bookmark_remove");

      if (isAuthenticated) {
        apiDelete(`/notebook/vocab/${id}`).then((res) => {
          if (!res.success && removedItem) {
            setNotebook((prev) => ({
              ...prev,
              vocab: [removedItem, ...prev.vocab],
            }));
            showToast("Xóa thất bại, vui lòng thử lại", "error");
          }
        });
      }
    },
    [isAuthenticated, showToast, notebook.vocab],
  );

  const saveGrammar = useCallback(
    (item: GrammarItem) => {
      // Optimistic update
      setNotebook((prev) => {
        if (prev.grammar.some((g) => g.id === item.id)) return prev;
        return { ...prev, grammar: [item, ...prev.grammar] };
      });
      showToast("Đã lưu ngữ pháp", "success", "bookmark");

      if (isAuthenticated) {
        apiPost(`/notebook/grammar/${item.id}`).then((res) => {
          if (!res.success) {
            // Revert on failure
            setNotebook((prev) => ({
              ...prev,
              grammar: prev.grammar.filter((g) => g.id !== item.id),
            }));
            showToast("Lưu thất bại, vui lòng thử lại", "error");
          }
        });
      }
    },
    [isAuthenticated, showToast],
  );

  const removeGrammar = useCallback(
    (id: string) => {
      const removedItem = notebook.grammar.find((g) => g.id === id);
      setNotebook((prev) => ({
        ...prev,
        grammar: prev.grammar.filter((g) => g.id !== id),
      }));
      showToast("Đã xóa ngữ pháp", "info", "bookmark_remove");

      if (isAuthenticated) {
        apiDelete(`/notebook/grammar/${id}`).then((res) => {
          if (!res.success && removedItem) {
            setNotebook((prev) => ({
              ...prev,
              grammar: [removedItem, ...prev.grammar],
            }));
            showToast("Xóa thất bại, vui lòng thử lại", "error");
          }
        });
      }
    },
    [isAuthenticated, showToast, notebook.grammar],
  );

  const isVocabSaved = useCallback(
    (id: string) => notebook.vocab.some((v) => v.id === id),
    [notebook.vocab],
  );

  const isGrammarSaved = useCallback(
    (id: string) => notebook.grammar.some((g) => g.id === id),
    [notebook.grammar],
  );

  return (
    <NotebookContext.Provider
      value={{
        notebook,
        saveVocab,
        removeVocab,
        saveGrammar,
        removeGrammar,
        isVocabSaved,
        isGrammarSaved,
      }}
    >
      {children}
    </NotebookContext.Provider>
  );
}

export function useNotebook() {
  const ctx = useContext(NotebookContext);
  if (!ctx) throw new Error("useNotebook must be used inside NotebookProvider");
  return ctx;
}
