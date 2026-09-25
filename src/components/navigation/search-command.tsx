"use client";

import { Search } from "lucide-react";
import dynamic from "next/dynamic";
import * as React from "react";

import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/utils";

/**
 * Loaded on first open — see `search-command-panel.tsx`.
 * `ssr: false`: the dialog is a portal that only exists after a click or ⌘K.
 */
const SearchCommandPanel = dynamic(
  () => import("@/components/navigation/search-command-panel").then((mod) => mod.SearchCommandPanel),
  { ssr: false },
);

/**
 * SearchCommand — the search entry point in the header.
 *
 * Owns the trigger and the keyboard shortcut; the dialog body (and the dialog
 * primitive it needs) is fetched the first time search is opened, which keeps it
 * off the critical path of every page. `⌘K` / `Ctrl+K` opens it on devices with
 * a keyboard; the button covers touch.
 */
export function SearchCommand({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <IconButton
        label="Search products"
        className={cn(
          "aria-expanded:bg-[#F3E6C8] aria-expanded:text-[#9A6A20]",
          className,
        )}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Search aria-hidden="true" />
      </IconButton>

      {open ? <SearchCommandPanel open={open} onOpenChange={setOpen} /> : null}
    </>
  );
}
