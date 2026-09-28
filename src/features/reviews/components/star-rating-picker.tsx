"use client";

import { Star } from "lucide-react";
import * as React from "react";

export function StarRatingPicker({
  value,
  onChange,
  disabled = false,
  size = "md",
}: {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

  const starSizeClass = size === "lg" ? "size-7" : size === "sm" ? "size-4" : "size-6";
  const activeRating = hoverValue !== null ? hoverValue : value;

  const ratingLabels: Record<number, string> = {
    1: "Poor (1/5)",
    2: "Fair (2/5)",
    3: "Average (3/5)",
    4: "Good (4/5)",
    5: "Exceptional (5/5)",
  };

  return (
    <div className="space-y-1.5">
      <div
        className="flex items-center gap-1.5"
        role="radiogroup"
        aria-label="Star rating selection"
        onMouseLeave={() => setHoverValue(null)}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isSelected = star <= activeRating;
          return (
            <button
              type="button"
              key={star}
              disabled={disabled}
              onClick={() => onChange(star)}
              onMouseEnter={() => setHoverValue(star)}
              onFocus={() => setHoverValue(star)}
              onBlur={() => setHoverValue(null)}
              className={`p-1 rounded-lg transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-[#E89535] ${
                disabled ? "cursor-not-allowed opacity-60" : "hover:scale-110 active:scale-95 cursor-pointer"
              }`}
              role="radio"
              aria-checked={star === value}
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
            >
              <Star
                className={`${starSizeClass} transition-colors duration-150 ${
                  isSelected
                    ? "fill-[#E89535] text-[#E89535] drop-shadow-sm"
                    : "fill-transparent text-[#DDD4C4] dark:text-stone-600"
                }`}
              />
            </button>
          );
        })}
      </div>

      {activeRating > 0 && (
        <span className="text-caption font-semibold text-[#D48024] dark:text-[#F0A349] block">
          {ratingLabels[activeRating]}
        </span>
      )}
    </div>
  );
}
