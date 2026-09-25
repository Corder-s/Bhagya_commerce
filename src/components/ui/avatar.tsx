import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

const avatarVariants = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center overflow-hidden",
    "bg-gold-soft/30 dark:bg-gold/15 text-gold-dark dark:text-gold font-sans font-semibold select-none",
    "border border-line",
  ],
  {
    variants: {
      size: {
        xs: "size-6 text-[0.625rem] rounded-sm",
        sm: "size-8 text-caption rounded-sm",
        md: "size-10 text-body-sm rounded-md",
        lg: "size-12 text-body-md rounded-md",
        xl: "size-16 text-heading-md rounded-lg",
      },
      shape: {
        rounded: "",
        circle: "rounded-pill",
      },
    },
    defaultVariants: { size: "md", shape: "rounded" },
  },
);

export interface AvatarProps
  extends Omit<React.ComponentProps<"span">, "children">,
    VariantProps<typeof avatarVariants> {
  src?: string | null;
  /** Full name — used for initials and the accessible label. */
  name: string;
  /** Overrides the alt text when the image conveys something specific. */
  alt?: string;
}

/**
 * Avatar — customer, merchant or brand identity.
 */
function Avatar({
  className,
  size,
  shape,
  src,
  name,
  alt,
  ...props
}: AvatarProps) {
  return (
    <span
      data-slot="avatar"
      className={cn(avatarVariants({ size, shape }), className)}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt ?? name}
          loading="lazy"
          decoding="async"
          className="size-full object-cover"
        />
      ) : (
        <>
          <span aria-hidden="true">{getInitials(name)}</span>
          <span className="sr-only">{name}</span>
        </>
      )}
    </span>
  );
}

export { Avatar, avatarVariants };
