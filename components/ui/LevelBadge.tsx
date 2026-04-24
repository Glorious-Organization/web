const levelColors: Record<number, string> = {
  1: "bg-primary-container/50 text-on-primary-container",
  2: "bg-secondary-container/50 text-on-secondary-container",
  3: "bg-tertiary-container/50 text-on-tertiary-container",
  4: "bg-surface-container-highest text-on-surface-variant",
  5: "bg-surface-container-highest text-on-surface-variant",
  6: "bg-inverse-surface/10 text-on-surface",
};

interface LevelBadgeProps {
  level: number;
  className?: string;
}

export default function LevelBadge({ level, className = "" }: LevelBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${levelColors[level] ?? levelColors[1]} ${className}`}
    >
      TOPIK {level}
    </span>
  );
}
