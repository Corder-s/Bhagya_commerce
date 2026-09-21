import type { ReactNode } from "react";

import { PageTransition } from "@/components/common/page-transition";

/**
 * Page transition for marketing routes.
 * Lives in `template.tsx` (not the layout) so it re-mounts per navigation while
 * the header and footer remain outside the animated wrapper.
 */
export default function MarketingTemplate({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
