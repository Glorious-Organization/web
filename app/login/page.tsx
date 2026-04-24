"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type Tab = "login" | "register";

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const EMPTY: FormState = { name: "", email: "", password: "", confirmPassword: "" };

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const [tab, setTab] = useState<Tab>("login");
  const [form, setForm] = useState<FormState>(EMPTY);
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [apiError, setApiError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      setErrors((err) => ({ ...err, [field]: "" }));
    };
  }

  function switchTab(t: Tab) {
    setTab(t);
    setForm(EMPTY);
    setErrors({});
    setApiError("");
  }

  function validate(): boolean {
    const errs: Partial<FormState> = {};
    if (tab === "register" && !form.name.trim()) errs.name = "Vui lòng nhập họ tên.";
    if (!form.email.includes("@")) errs.email = "Email không hợp lệ.";
    if (form.password.length < 6) errs.password = "Mật khẩu tối thiểu 6 ký tự.";
    if (tab === "register" && form.password !== form.confirmPassword)
      errs.confirmPassword = "Mật khẩu xác nhận không khớp.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError("");

    try {
      if (tab === "login") {
        await auth.login(form.email, form.password);
      } else {
        await auth.register(form.name, form.email, form.password);
      }
      router.push("/");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Đã xảy ra lỗi. Vui lòng thử lại.";
      setApiError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-surface-container-lowest rounded-3xl shadow-xl shadow-on-surface/5 p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="font-headline font-bold text-2xl text-primary tracking-tight">
              Huyên Korean
            </Link>
            <p className="text-sm text-on-surface-variant mt-1">
              {tab === "login" ? "Chào mừng bạn trở lại 👋" : "Tạo tài khoản miễn phí"}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-surface-container rounded-full p-1 mb-8">
            {(["login", "register"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${
                  tab === t
                    ? "bg-surface-container-lowest text-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {t === "login" ? "Đăng nhập" : "Đăng ký"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Name — register only */}
            {tab === "register" && (
              <Field
                label="Họ tên"
                icon="person"
                type="text"
                placeholder="Nguyễn Thị Huyên"
                value={form.name}
                onChange={set("name")}
                error={errors.name}
              />
            )}

            <Field
              label="Email"
              icon="mail"
              type="email"
              placeholder="email@example.com"
              value={form.email}
              onChange={set("email")}
              error={errors.email}
            />

            <PasswordField
              label="Mật khẩu"
              placeholder="Tối thiểu 6 ký tự"
              value={form.password}
              onChange={set("password")}
              show={showPw}
              onToggle={() => setShowPw((v) => !v)}
              error={errors.password}
            />

            {tab === "register" && (
              <PasswordField
                label="Xác nhận mật khẩu"
                placeholder="Nhập lại mật khẩu"
                value={form.confirmPassword}
                onChange={set("confirmPassword")}
                show={showConfirmPw}
                onToggle={() => setShowConfirmPw((v) => !v)}
                error={errors.confirmPassword}
              />
            )}

            {tab === "login" && (
              <div className="text-right">
                <Link href="#" className="text-xs text-primary hover:underline">
                  Quên mật khẩu?
                </Link>
              </div>
            )}

            {apiError && (
              <div className="bg-error-container/50 text-on-error-container text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                {apiError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary font-bold py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading && (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              )}
              {tab === "login" ? "Đăng nhập" : "Tạo tài khoản"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-outline-variant/30" />
            <span className="text-xs text-on-surface-variant">hoặc</span>
            <div className="flex-1 h-px bg-outline-variant/30" />
          </div>

          {/* Google */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 bg-surface-container text-on-surface font-medium py-3 rounded-full hover:bg-surface-container-high transition-colors"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Tiếp tục với Google
          </button>

          <p className="text-center text-xs text-on-surface-variant mt-6">
            {tab === "login" ? (
              <>
                Chưa có tài khoản?{" "}
                <button onClick={() => switchTab("register")} className="text-primary hover:underline font-medium">
                  Đăng ký miễn phí
                </button>
              </>
            ) : (
              <>
                Đã có tài khoản?{" "}
                <button onClick={() => switchTab("login")} className="text-primary hover:underline font-medium">
                  Đăng nhập
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Reusable field components ── */

function Field({
  label,
  icon,
  type,
  placeholder,
  value,
  onChange,
  error,
}: {
  label: string;
  icon: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-on-surface-variant mb-1.5 block">{label}</label>
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-lg">
          {icon}
        </span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full pl-10 pr-4 py-3 rounded-xl bg-surface-container text-on-surface placeholder:text-on-surface-variant/40 outline-none transition ${
            error ? "ring-2 ring-error/50" : "focus:ring-2 focus:ring-primary/30"
          }`}
        />
      </div>
      {error && <p className="text-xs text-error mt-1">{error}</p>}
    </div>
  );
}

function PasswordField({
  label,
  placeholder,
  value,
  onChange,
  show,
  onToggle,
  error,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  show: boolean;
  onToggle: () => void;
  error?: string;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-on-surface-variant mb-1.5 block">{label}</label>
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-lg">
          lock
        </span>
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full pl-10 pr-11 py-3 rounded-xl bg-surface-container text-on-surface placeholder:text-on-surface-variant/40 outline-none transition ${
            error ? "ring-2 ring-error/50" : "focus:ring-2 focus:ring-primary/30"
          }`}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-on-surface-variant transition-colors"
          aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        >
          <span className="material-symbols-outlined text-lg">
            {show ? "visibility_off" : "visibility"}
          </span>
        </button>
      </div>
      {error && <p className="text-xs text-error mt-1">{error}</p>}
    </div>
  );
}
