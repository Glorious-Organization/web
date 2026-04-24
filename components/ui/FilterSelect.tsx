"use client";

import * as Select from "@radix-ui/react-select";

interface Option {
  value: string;
  label: string;
}

interface FilterSelectProps {
  value: string;
  onValueChange: (v: string) => void;
  options: Option[];
  icon: string;
  active?: boolean;
}

export default function FilterSelect({
  value,
  onValueChange,
  options,
  icon,
  active = false,
}: FilterSelectProps) {
  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger
        className={[
          "flex items-center gap-1.5 pl-3 pr-2.5 py-2 rounded-full text-sm font-medium border outline-none",
          "transition-all duration-200 cursor-pointer select-none focus:ring-2 focus:ring-primary/20",
          active
            ? "bg-primary text-on-primary border-primary"
            : "bg-surface-container-lowest text-on-surface-variant border-outline-variant/30 hover:bg-primary-container/30 hover:border-primary/20",
        ].join(" ")}
      >
        <span className="material-symbols-outlined text-[18px] leading-none">{icon}</span>
        <Select.Value />
        <Select.Icon asChild>
          <span className="material-symbols-outlined text-[18px] leading-none opacity-60">expand_more</span>
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={6}
          avoidCollisions
          className="z-[100] w-[var(--radix-select-trigger-width)] min-w-[180px] overflow-hidden rounded-2xl bg-surface-container-lowest shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-outline-variant/20 animate-[fade-in-up_0.15s_ease-out]"
        >
          <Select.Viewport className="p-1.5">
            {options.map((opt) => (
              <Select.Item
                key={opt.value}
                value={opt.value}
                className="group relative flex items-center px-3 py-2.5 rounded-xl text-sm text-on-surface cursor-pointer outline-none select-none
                  data-[highlighted]:bg-primary-container/60
                  transition-colors duration-100"
              >
                {/* Check icon — visible khi selected */}
                <span className="mr-2 w-4 shrink-0 flex items-center justify-center">
                  <Select.ItemIndicator>
                    <span className="material-symbols-outlined text-[16px] text-primary leading-none">check</span>
                  </Select.ItemIndicator>
                </span>
                <Select.ItemText>
                  <span className="data-[state=checked]:font-semibold data-[state=checked]:text-primary">
                    {opt.label}
                  </span>
                </Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
