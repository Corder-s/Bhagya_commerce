"use client";

import { Search } from "lucide-react";
import * as React from "react";

import { Input } from "@/components/ui/input";
import { Modal, ModalContent } from "@/components/ui/modal";
import { marketingRoutes } from "@/config/routes";

/**
 * SearchCommandPanel — the search dialog body, fetched on first open.
 *
 * Phase 1 ships the real interaction shell (dialog, focus handling, keyboard
 * affordance, suggestions copy) with no query engine behind it: submitting does
 * nothing yet. Wiring a search service and the results route is Phase 2 work —
 * the point is that the header already owns the pattern.
 */
export function SearchCommandPanel({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent
        title="Search Bhagya Commerce"
        description="Find products, brands and collections"
        size="md"
      >
        <form
          role="search"
          className="flex flex-col gap-4"
          action={marketingRoutes.search}
          onSubmit={(event) => {
            // Phase 1: no search backend. Keeps the form honest — no fake results.
            event.preventDefault();
          }}
        >
          <Input
            type="search"
            name="q"
            autoFocus
            inputSize="lg"
            leadingIcon={<Search aria-hidden="true" />}
            placeholder="Search for handloom, ceramics, cold-pressed oils…"
            aria-label="Search"
          />

          <div className="flex flex-col gap-2">
            <p className="label-text text-ink-faint">Popular right now</p>
            <ul className="flex flex-wrap gap-2">
              {["Handloom cotton", "Terracotta", "Millets", "Ayurvedic skin", "Brass"].map(
                (term) => (
                  <li key={term}>
                    <span className="inline-flex min-h-9 items-center rounded-pill border border-line bg-canvas px-3 text-caption text-ink-soft">
                      {term}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>

          <p className="border-t border-line pt-3 text-caption text-ink-faint">
            Search results arrive in Phase 2. Until then, browse{" "}
            <span className="text-ink-soft">Shop</span>,{" "}
            <span className="text-ink-soft">Brands</span> and{" "}
            <span className="text-ink-soft">Collections</span>.
          </p>
        </form>
      </ModalContent>
    </Modal>
  );
}
