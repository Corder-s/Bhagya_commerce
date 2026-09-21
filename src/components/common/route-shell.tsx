import { ArrowRight, Clock3 } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import * as React from "react";

import { Reveal } from "@/components/common/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { marketingRoutes } from "@/config/routes";
import { cn } from "@/lib/utils";

export interface RouteShellProps {
  eyebrow: string;
  title: string;
  description: string;
  /** What this route will contain. Written as a product promise, not a TODO. */
  coming: readonly string[];
  /** Related destinations worth visiting in the meantime. */
  related?: readonly { label: string; href: Route; description: string }[];
  /** Optional visual: the section that already covers this surface. */
  highlight?: React.ReactNode;
  className?: string;
}

/**
 * RouteShell — the "coming next" page used by /shop, /brands, /collections and
 * /journal until their real surfaces are built.
 *
 * It is a designed page, not a placeholder screen: a proper header, an honest
 * statement of what will live here, the services it depends on, and links to
 * what *is* live today. This keeps every navigation destination meaningful in
 * the first version without pretending the catalogue exists.
 */
export function RouteShell({
  eyebrow,
  title,
  description,
  coming,
  related,
  highlight,
  className,
}: RouteShellProps) {
  return (
    <>
      <Section spacing="sm" surface="canvas">
        <PageHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          breadcrumbs={[{ label: "Home", href: marketingRoutes.home }, { label: title }]}
          meta={
            <Badge tone="gold" size="lg">
              <Clock3 className="size-3.5" aria-hidden="true" />
              Coming next
            </Badge>
          }
        />
      </Section>

      <Section surface="ivory" className={cn(className)}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-display-md font-medium text-ink text-balance">
              What will live here
            </h2>

            <ul className="flex flex-col divide-y divide-line border-y border-line">
              {coming.map((item) => (
                <li key={item} className="flex items-start gap-3 py-4">
                  <ArrowRight
                    className="mt-1 size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span className="text-body-md text-ink-soft">{item}</span>
                </li>
              ))}
            </ul>

            <p className="text-caption text-ink-faint">
              Until then, the homepage is the complete experience — browse the
              categories, the featured collection and the makers there.
            </p>
          </div>

          <Reveal className="flex flex-col gap-5">
            <Card variant="botanical" padding="lg" radius="lg">
              <CardContent className="flex flex-col gap-4">
                <p className="label-text text-primary">Available now</p>
                <ul className="flex flex-col gap-3">
                  {(related ?? []).map((item) => (
                    <li key={`${item.href}-${item.label}`}>
                      <Link
                        href={item.href}
                        className="group flex flex-col gap-0.5 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2"
                      >
                        <span className="flex items-center gap-1.5 text-body-md font-medium text-ink group-hover:text-primary">
                          {item.label}
                          <ArrowRight
                            className="size-3.5 transition-transform duration-fast group-hover:translate-x-0.5"
                            aria-hidden="true"
                          />
                        </span>
                        <span className="text-caption text-ink-soft">
                          {item.description}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>

                <Button asChild variant="primary" size="md" className="mt-1 w-fit">
                  <Link href={marketingRoutes.home}>Back to homepage</Link>
                </Button>
              </CardContent>
            </Card>

            {highlight}
          </Reveal>
        </div>
      </Section>
    </>
  );
}
