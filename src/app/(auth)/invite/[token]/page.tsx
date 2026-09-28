import type { Metadata } from "next";
import * as React from "react";

import { constructMetadata } from "@/config/seo";
import { InviteAcceptanceView } from "@/features/auth/invite-acceptance-view";

interface Props {
  params: Promise<{ token: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { token } = await props.params;

  return constructMetadata({
    title: "Organization Team Invitation",
    description: "Accept your Bhagya Commerce merchant organization invitation.",
    path: `/invite/${token}`,
    noIndex: true,
  });
}

export default async function InviteAcceptancePage(props: Props) {
  const { token } = await props.params;

  return (
    <>
      <React.Suspense
        fallback={
          <div className="flex h-64 items-center justify-center rounded-2xl border border-stone-200 bg-white p-8 dark:border-stone-800 dark:bg-stone-900">
            <div className="size-8 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
          </div>
        }
      >
        <InviteAcceptanceView token={token} />
      </React.Suspense>
    </>
  );
}
