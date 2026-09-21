import type { ReactNode } from "react";

import { PageTransition } from "@/components/common/page-transition";

export default function MerchantTemplate({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
