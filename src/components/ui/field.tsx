"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Form-field plumbing.
 *
 * `Field` owns the ids and the invalid/description wiring, so controls placed
 * inside it pick up `id`, `aria-describedby` and `aria-invalid` automatically
 * (see `useFieldControl`). Call sites therefore get accessible forms for free
 * and cannot forget the wiring.
 */

interface FieldContextValue {
  controlId: string;
  labelId: string;
  descriptionId: string;
  errorId: string;
  describedBy: string | undefined;
  invalid: boolean;
  required: boolean;
}

const FieldContext = React.createContext<FieldContextValue | null>(null);

/** Props a wrapped control should spread onto its element. */
export interface FieldControlProps {
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  "aria-required"?: boolean;
}

/**
 * Reads the surrounding `Field` (if any) and returns the props the control
 * should apply to its `<input>` / `<textarea>` / trigger.
 */
export function useFieldControl(
  explicit?: { id?: string; describedBy?: string; invalid?: boolean },
): FieldControlProps & { invalid: boolean } {
  const field = React.useContext(FieldContext);

  if (!field) {
    return {
      id: explicit?.id,
      "aria-describedby": explicit?.describedBy,
      "aria-invalid": explicit?.invalid || undefined,
      invalid: Boolean(explicit?.invalid),
    };
  }

  return {
    id: explicit?.id ?? field.controlId,
    "aria-describedby": explicit?.describedBy ?? field.describedBy,
    "aria-invalid": field.invalid || undefined,
    "aria-required": field.required || undefined,
    invalid: field.invalid || Boolean(explicit?.invalid),
  };
}

export interface FieldProps extends React.ComponentProps<"div"> {
  label?: React.ReactNode;
  /** Helper text under the control, referenced by `aria-describedby`. */
  description?: React.ReactNode;
  /** Error message — its presence marks the field invalid and is announced. */
  error?: React.ReactNode;
  required?: boolean;
  /** Small right-aligned hint beside the label (e.g. "Optional"). */
  hint?: React.ReactNode;
  id?: string;
}

function Field({
  label,
  description,
  error,
  required = false,
  hint,
  id,
  className,
  children,
  ...props
}: FieldProps) {
  const generatedId = React.useId();
  const controlId = id ?? generatedId;
  const invalid = Boolean(error);

  const descriptionId = `${controlId}-description`;
  const errorId = `${controlId}-error`;

  const describedBy =
    [description ? descriptionId : null, invalid ? errorId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  const value: FieldContextValue = {
    controlId,
    labelId: `${controlId}-label`,
    descriptionId,
    errorId,
    describedBy,
    invalid,
    required,
  };

  return (
    <FieldContext.Provider value={value}>
      <div
        data-slot="field"
        data-invalid={invalid || undefined}
        className={cn("flex w-full flex-col gap-2", className)}
        {...props}
      >
        {label ? (
          <div className="flex items-baseline justify-between gap-3">
            <label
              htmlFor={controlId}
              className="text-body-sm font-medium text-ink"
            >
              {label}
              {required ? (
                <>
                  <span aria-hidden="true" className="ml-1 text-danger">
                    *
                  </span>
                  <span className="sr-only"> (required)</span>
                </>
              ) : null}
            </label>
            {hint ? (
              <span className="text-caption text-ink-soft">{hint}</span>
            ) : null}
          </div>
        ) : null}

        {children}

        {description ? (
          <p id={descriptionId} className="text-caption text-ink-soft">
            {description}
          </p>
        ) : null}

        {invalid ? (
          <p
            id={errorId}
            role="alert"
            className="flex items-start gap-1.5 text-caption font-medium text-danger"
          >
            {/* Status is carried by text + shape, never colour alone. */}
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="mt-0.5 size-3.5 shrink-0 fill-current"
            >
              <path d="M8 1.5 15 14H1L8 1.5Zm0 4v4h1.4a.7.7 0 0 0 0-1.4H7.3a.7.7 0 0 0 0 1.4H8V5.5Zm0 6.6a.9.9 0 1 0 0-1.8.9.9 0 0 0 0 1.8Z" />
            </svg>
            <span>{error}</span>
          </p>
        ) : null}
      </div>
    </FieldContext.Provider>
  );
}

/** Shared control styling so input, textarea and select cannot drift apart. */
export const controlBase = [
  "w-full rounded-md border bg-surface text-ink",
  "border-line-strong",
  "transition-[border-color,box-shadow,background-color] duration-fast ease-brand",
  "placeholder:text-ink-faint",
  "hover:border-ink-subtle",
  "focus:border-primary focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]",
  "disabled:cursor-not-allowed disabled:bg-canvas-deep disabled:text-ink-faint disabled:border-line",
  "aria-invalid:border-danger aria-invalid:focus-visible:outline-[var(--bhagya-danger)]",
] as const;

export const controlBaseString = controlBase.join(" ");

export { Field };
