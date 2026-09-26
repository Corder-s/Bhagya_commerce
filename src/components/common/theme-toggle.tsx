"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  variant?: "icon" | "segmented";
}

export function ThemeToggle({ className, variant = "icon" }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "size-9 rounded-xl border border-transparent bg-surface-sunken opacity-60",
          className,
        )}
        aria-hidden="true"
      />
    );
  }

  if (variant === "segmented") {
    return (
      <div
        role="radiogroup"
        aria-label="Color theme selection"
        className={cn(
          "inline-flex items-center rounded-xl p-1 bg-surface-sunken border border-line text-xs font-medium",
          className,
        )}
      >
        <button
          type="button"
          role="radio"
          aria-checked={theme === "light"}
          onClick={() => setTheme("light")}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer",
            theme === "light"
              ? "bg-primary text-[#181714] font-semibold shadow-xs"
              : "text-ink-soft hover:text-ink",
          )}
        >
          <Sun className="size-3.5" />
          <span>Light</span>
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={theme === "dark"}
          onClick={() => setTheme("dark")}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer",
            theme === "dark"
              ? "bg-primary text-[#181714] font-semibold shadow-xs"
              : "text-ink-soft hover:text-ink",
          )}
        >
          <Moon className="size-3.5" />
          <span>Dark</span>
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={theme === "system"}
          onClick={() => setTheme("system")}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer",
            theme === "system"
              ? "bg-primary text-[#181714] font-semibold shadow-xs"
              : "text-ink-soft hover:text-ink",
          )}
        >
          <Monitor className="size-3.5" />
          <span>System</span>
        </button>
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={cn(
        "relative flex size-9 items-center justify-center rounded-xl",
        "bg-surface hover:bg-surface-sunken border border-line hover:border-primary/50",
        "text-ink hover:text-primary transition-all duration-base cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        className,
      )}
    >
      <Sun
        className={cn(
          "size-4 transition-transform duration-slow text-ink",
          isDark ? "rotate-90 scale-0 opacity-0 absolute" : "rotate-0 scale-100 opacity-100",
        )}
      />
      <Moon
        className={cn(
          "size-4 transition-transform duration-slow text-[#DDBB72]",
          isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0 absolute",
        )}
      />
    </button>
  );
}
