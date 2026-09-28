import type { Metadata } from "next";

import { TeamMembersView } from "@/features/merchant/team/components/team-members-view";

export const metadata: Metadata = {
  title: "Team & Role Management | Bhagya Commerce Merchant",
  description:
    "Manage merchant organization team members, assign granular role permissions, configure multi-store access scoping, and send secure single-use team invitations.",
};

export default function MerchantTeamPage() {
  return <TeamMembersView />;
}
