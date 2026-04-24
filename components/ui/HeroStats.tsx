"use client";

import { useCountUp } from "./useCountUp";

const stats = [
  { rawValue: 3000, display: "3.000+", label: "Từ vựng", icon: "translate" },
  { rawValue: 200, display: "200+", label: "Cấu trúc ngữ pháp", icon: "menu_book" },
  { rawValue: 10000, display: "10.000+", label: "Người học", icon: "group" },
];

function StatItem({ rawValue, display, label, icon }: (typeof stats)[0]) {
  const { count, ref } = useCountUp(rawValue, 1400);
  const formatted = count >= rawValue ? display : count.toLocaleString("vi-VN");

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
        <span className="material-symbols-outlined text-sm text-white/80">{icon}</span>
      </div>
      <div>
        <p className="font-headline font-bold text-white text-sm leading-none">{formatted}</p>
        <p className="font-label text-white/50 text-xs mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default function HeroStats() {
  return (
    <div className="mt-10 flex flex-wrap gap-6 animate-[fade-in-up_0.8s_ease-out_0.8s_both]">
      {stats.map((stat) => (
        <StatItem key={stat.label} {...stat} />
      ))}
    </div>
  );
}
