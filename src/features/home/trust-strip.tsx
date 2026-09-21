import { BadgeCheck, IndianRupee, Leaf, Truck } from "lucide-react";
import * as React from "react";

import type { NavIconMap } from "@/types/navigation";

/**
 * TrustStrip — four promises, one horizontal band.
 *
 * Deliberately *not* cards: a row of boxed icons is the single most generic
 * thing an Indian marketplace can do. This is a hairline-bounded strip with the
 * icon, the promise and one clarifying line, separated by rules and allowed to
 * wrap on small screens. Each promise is a claim we can keep, so none of them
 * invent a statistic or a certification.
 */
const promises = [
  {
    Icon: BadgeCheck,
    title: "Authentic Products",
    detail: "Sourced from verified independent brands",
  },
  {
    Icon: IndianRupee,
    title: "Secure Payments",
    detail: "Encrypted checkout, UPI and cards",
  },
  {
    Icon: Truck,
    title: "Reliable Delivery",
    detail: "Tracked pan-India shipping",
  },
  {
    Icon: Leaf,
    title: "Conscious Choices",
    detail: "Lower-waste packaging on every parcel",
  },
] as const satisfies readonly { Icon: NavIconMap[keyof NavIconMap]; title: string; detail: string }[];

export function TrustStrip() {
  return (
    <section aria-label="What Bhagya Commerce promises" className="border-y border-line bg-surface">
      <div className="container-wide">
        <ul className="grid divide-y divide-line sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
          {promises.map(({ Icon, title, detail }, index) => (
            <li
              key={title}
              className={[
                "flex items-start gap-3.5 py-5 sm:py-6",
                // Vertical rules between columns, restarting each row.
                index % 2 === 1 ? "sm:border-l sm:border-line sm:pl-6" : "",
                "lg:border-l lg:border-line lg:pl-6",
                index === 0 ? "lg:border-l-0 lg:pl-0" : "",
                index === 2 ? "lg:border-t-0" : "",
                "sm:pr-6 lg:pr-6",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              <div className="flex flex-col gap-0.5">
                <h2 className="text-body-sm font-semibold text-ink">{title}</h2>
                <p className="text-caption text-ink-soft">{detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
