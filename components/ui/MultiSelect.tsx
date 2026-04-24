"use client";

import * as Popover from "@radix-ui/react-popover";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  values: string[];
  onValuesChange: (values: string[]) => void;
  options: Option[];
  icon: string;
  placeholder: string;
  activeColor?: "primary" | "tertiary";
}

export default function MultiSelect({
  values,
  onValuesChange,
  options,
  icon,
  placeholder,
  activeColor = "primary",
}: MultiSelectProps) {
  const isActive = values.length > 0;

  function toggle(value: string) {
    if (values.includes(value)) {
      onValuesChange(values.filter((v) => v !== value));
    } else {
      onValuesChange([...values, value]);
    }
  }

  function clear() {
    onValuesChange([]);
  }

  const triggerLabel = isActive
    ? values.length === 1
      ? options.find((o) => o.value === values[0])?.label ?? placeholder
      : `${values.length} đã chọn`
    : placeholder;

  const activeTrigger =
    activeColor === "tertiary"
      ? "bg-tertiary/10 text-tertiary border-tertiary/40"
      : "bg-primary/10 text-primary border-primary/40";

  const inactiveTrigger =
    "bg-surface-container-lowest text-on-surface-variant border-outline-variant/30 hover:border-primary/30 hover:text-on-surface";

  const checkBg =
    activeColor === "tertiary" ? "bg-tertiary" : "bg-primary";

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className={[
            "flex items-center gap-1.5 h-9 pl-3 pr-2.5 rounded-full text-sm font-medium border outline-none",
            "transition-all duration-150 cursor-pointer select-none",
            isActive ? activeTrigger : inactiveTrigger,
          ].join(" ")}
        >
          <span className="material-symbols-outlined text-[17px] leading-none opacity-80">
            {icon}
          </span>
          <span className="leading-none">{triggerLabel}</span>
          {isActive ? (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => { e.stopPropagation(); clear(); }}
              onKeyDown={(e) => e.key === "Enter" && (e.stopPropagation(), clear())}
              className="ml-0.5 w-4 h-4 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors cursor-pointer"
              aria-label="Xóa bộ lọc"
            >
              <span className="material-symbols-outlined text-[14px] leading-none">close</span>
            </span>
          ) : (
            <span className="material-symbols-outlined text-[17px] leading-none opacity-50">
              expand_more
            </span>
          )}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={6}
          align="start"
          avoidCollisions
          className="z-[100] min-w-[180px] rounded-2xl bg-surface-container-lowest shadow-[0_4px_24px_rgba(0,0,0,0.10)] border border-outline-variant/15 outline-none animate-[fade-in-up_0.15s_ease-out]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-3.5 pb-2.5 border-b border-outline-variant/10">
            <span className="text-[11px] font-semibold text-on-surface-variant/60 uppercase tracking-[0.08em]">
              {placeholder}
            </span>
            {isActive && (
              <button
                onClick={clear}
                className="text-xs font-medium text-primary/80 hover:text-primary transition-colors cursor-pointer"
              >
                Bỏ chọn
              </button>
            )}
          </div>

          {/* Options */}
          <div className="p-2 max-h-60 overflow-y-auto flex flex-col gap-0.5">
            {options.map((opt) => {
              const checked = values.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => toggle(opt.value)}
                  className={[
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left",
                    "transition-colors duration-100 cursor-pointer outline-none",
                    checked
                      ? "bg-primary-container/30 text-on-surface"
                      : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface",
                  ].join(" ")}
                >
                  {/* Custom checkbox visual */}
                  <span
                    className={[
                      "w-4 h-4 shrink-0 rounded-[5px] border-[1.5px] flex items-center justify-center transition-all duration-150",
                      checked
                        ? `${checkBg} border-transparent`
                        : "border-outline-variant/50 bg-transparent",
                    ].join(" ")}
                  >
                    {checked && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path
                          d="M1 4L3.5 6.5L9 1"
                          stroke="white"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span className={`${checked ? "font-medium text-on-surface" : ""}`}>
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Footer count */}
          {isActive && (
            <div className="px-4 py-2.5 border-t border-outline-variant/10">
              <span className="text-xs text-on-surface-variant/50">
                Đã chọn {values.length}/{options.length}
              </span>
            </div>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
