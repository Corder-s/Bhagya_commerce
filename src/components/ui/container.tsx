import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Container — horizontal rhythm.
 *
 * `content` is the everyday page container; `wide` for merchandising grids;
 * `narrow` for prose and auth; `full` for editorial bleed.
 */
function Container({
  className,
  width = "content",
  as: Component = "div",
  ...props
}: React.ComponentProps<"div"> & {
  width?: "narrow" | "content" | "wide" | "full";
  as?: React.ElementType;
}) {
  const widthClass = {
    narrow: "container-narrow",
    content: "container-page",
    wide: "container-wide",
    full: "w-full",
  }[width];

  return (
    <Component
      data-slot="container"
      className={cn(widthClass, className)}
      {...props}
    />
  );
}

export { Container };
