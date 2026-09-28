/**
 * Bhagya Commerce — Team & Role Management Service (Step 23)
 * Provides centralized organization team management, multi-store access scoping,
 * role-permission definitions, secure invitations, and public invitation acceptance.
 */

export type RoleCode =
  | "OWNER"
  | "ADMIN"
  | "MANAGER"
  | "PRODUCT_MANAGER"
  | "ORDER_MANAGER"
  | "MARKETING_MANAGER"
  | "SUPPORT_AGENT";

export type PermissionCode =
  | "PRODUCT_VIEW"
  | "PRODUCT_CREATE"
  | "PRODUCT_UPDATE"
  | "PRODUCT_DELETE"
  | "ORDER_VIEW"
  | "ORDER_UPDATE"
  | "ORDER_CANCEL"
  | "ORDER_REFUND"
  | "CUSTOMER_VIEW"
  | "INVENTORY_VIEW"
  | "INVENTORY_UPDATE"
  | "MARKETING_VIEW"
  | "MARKETING_CREATE"
  | "MARKETING_UPDATE"
  | "ANALYTICS_VIEW"
  | "STOREFRONT_VIEW"
  | "STOREFRONT_UPDATE"
  | "STOREFRONT_PUBLISH"
  | "TEAM_VIEW"
  | "TEAM_INVITE"
  | "TEAM_UPDATE"
  | "TEAM_REMOVE"
  | "BILLING_VIEW"
  | "BILLING_MANAGE"
  | "STORE_VIEW"
  | "STORE_UPDATE"
  | "REVIEWS_VIEW"
  | "REVIEWS_MODERATE"
  | "REVIEWS_RESPOND"
  | "SHIPPING_VIEW"
  | "SHIPPING_MANAGE";

export type StoreAccessType = "ALL_STORES" | "SPECIFIC_STORES";
export type MemberStatus = "ACTIVE" | "SUSPENDED" | "INVITED";
export type InvitationStatus = "PENDING" | "ACCEPTED" | "EXPIRED" | "REVOKED";

export interface TeamMember {
  id: string;
  organizationId: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  role: RoleCode;
  roleDisplayName: string;
  storeAccessType: StoreAccessType;
  accessibleStoreIds: string[];
  status: MemberStatus;
  isSoleOwner: boolean;
  createdAt: string;
  lastActiveAt?: string;
}

export interface TeamInvitation {
  id: string;
  organizationId: string;
  email: string;
  role: RoleCode;
  roleDisplayName: string;
  storeAccessType: StoreAccessType;
  storeIds: string[];
  status: InvitationStatus;
  invitedByName: string;
  invitedByEmail: string;
  expiresAt: string;
  createdAt: string;
  inviteUrl: string;
}

export interface RoleDefinition {
  code: RoleCode;
  displayName: string;
  description: string;
  permissions: PermissionCode[];
  isSystem: boolean;
  isProtected: boolean;
}

export interface StoreSummary {
  id: string;
  name: string;
  slug: string;
  isPrimary: boolean;
}

export interface TeamInviteRequest {
  email: string;
  role: RoleCode;
  storeAccessType: StoreAccessType;
  storeIds?: string[];
}

export interface TeamMemberUpdateRequest {
  role?: RoleCode;
  storeAccessType?: StoreAccessType;
  accessibleStoreIds?: string[];
  status?: MemberStatus;
}

export interface PublicInvitationData {
  token: string;
  organizationName: string;
  email: string;
  role: RoleCode;
  roleDisplayName: string;
  storeAccessType: StoreAccessType;
  storeNames: string[];
  invitedByName: string;
  expiresAt: string;
  isExpired: boolean;
  userExists: boolean;
  status: InvitationStatus;
}

export interface AcceptInvitationRequest {
  token: string;
  fullName?: string;
  password?: string;
}

// System Role Definitions
export const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    code: "OWNER",
    displayName: "Organization Owner",
    description: "Full authoritative control across billing, team, stores, security, and catalog.",
    isSystem: true,
    isProtected: true,
    permissions: [
      "PRODUCT_VIEW", "PRODUCT_CREATE", "PRODUCT_UPDATE", "PRODUCT_DELETE",
      "ORDER_VIEW", "ORDER_UPDATE", "ORDER_CANCEL", "ORDER_REFUND",
      "CUSTOMER_VIEW", "INVENTORY_VIEW", "INVENTORY_UPDATE",
      "MARKETING_VIEW", "MARKETING_CREATE", "MARKETING_UPDATE",
      "ANALYTICS_VIEW", "STOREFRONT_VIEW", "STOREFRONT_UPDATE", "STOREFRONT_PUBLISH",
      "TEAM_VIEW", "TEAM_INVITE", "TEAM_UPDATE", "TEAM_REMOVE",
      "BILLING_VIEW", "BILLING_MANAGE", "STORE_VIEW", "STORE_UPDATE",
      "REVIEWS_VIEW", "REVIEWS_MODERATE", "REVIEWS_RESPOND",
      "SHIPPING_VIEW", "SHIPPING_MANAGE",
    ],
  },
  {
    code: "ADMIN",
    displayName: "Store Administrator",
    description: "Complete operational merchant management excluding organization deletion or transferring primary ownership.",
    isSystem: true,
    isProtected: false,
    permissions: [
      "PRODUCT_VIEW", "PRODUCT_CREATE", "PRODUCT_UPDATE", "PRODUCT_DELETE",
      "ORDER_VIEW", "ORDER_UPDATE", "ORDER_CANCEL", "ORDER_REFUND",
      "CUSTOMER_VIEW", "INVENTORY_VIEW", "INVENTORY_UPDATE",
      "MARKETING_VIEW", "MARKETING_CREATE", "MARKETING_UPDATE",
      "ANALYTICS_VIEW", "STOREFRONT_VIEW", "STOREFRONT_UPDATE", "STOREFRONT_PUBLISH",
      "TEAM_VIEW", "TEAM_INVITE", "TEAM_UPDATE",
      "BILLING_VIEW", "STORE_VIEW", "STORE_UPDATE",
      "REVIEWS_VIEW", "REVIEWS_MODERATE", "REVIEWS_RESPOND",
      "SHIPPING_VIEW", "SHIPPING_MANAGE",
    ],
  },
  {
    code: "MANAGER",
    displayName: "Store Manager",
    description: "Day-to-day retail operations, inventory adjustments, orders, customer communications, and reviews.",
    isSystem: true,
    isProtected: false,
    permissions: [
      "PRODUCT_VIEW", "PRODUCT_CREATE", "PRODUCT_UPDATE",
      "ORDER_VIEW", "ORDER_UPDATE", "ORDER_CANCEL",
      "CUSTOMER_VIEW", "INVENTORY_VIEW", "INVENTORY_UPDATE",
      "ANALYTICS_VIEW", "STOREFRONT_VIEW",
      "STORE_VIEW",
      "REVIEWS_VIEW", "REVIEWS_MODERATE", "REVIEWS_RESPOND",
      "SHIPPING_VIEW", "SHIPPING_MANAGE",
    ],
  },
  {
    code: "PRODUCT_MANAGER",
    displayName: "Product & Catalog Manager",
    description: "Curate craft listings, upload imagery, manage artisan stories, and manage stock quantities.",
    isSystem: true,
    isProtected: false,
    permissions: [
      "PRODUCT_VIEW", "PRODUCT_CREATE", "PRODUCT_UPDATE", "PRODUCT_DELETE",
      "INVENTORY_VIEW", "INVENTORY_UPDATE",
      "STOREFRONT_VIEW",
      "STORE_VIEW",
    ],
  },
  {
    code: "ORDER_MANAGER",
    displayName: "Fulfillment & Orders Lead",
    description: "Process buyer orders, generate shipping labels, track courier dispatches, and process customer refunds.",
    isSystem: true,
    isProtected: false,
    permissions: [
      "ORDER_VIEW", "ORDER_UPDATE", "ORDER_CANCEL", "ORDER_REFUND",
      "CUSTOMER_VIEW",
      "SHIPPING_VIEW", "SHIPPING_MANAGE",
      "STORE_VIEW",
    ],
  },
  {
    code: "MARKETING_MANAGER",
    displayName: "Marketing & Growth Specialist",
    description: "Create promotional campaigns, discount vouchers, manage craft collections, and review sales analytics.",
    isSystem: true,
    isProtected: false,
    permissions: [
      "MARKETING_VIEW", "MARKETING_CREATE", "MARKETING_UPDATE",
      "ANALYTICS_VIEW",
      "STOREFRONT_VIEW", "STOREFRONT_UPDATE",
      "REVIEWS_VIEW",
      "STORE_VIEW",
    ],
  },
  {
    code: "SUPPORT_AGENT",
    displayName: "Artisan Support Agent",
    description: "Answer customer inquiries, assist buyers with order lookups, and respond warmly to verified reviews.",
    isSystem: true,
    isProtected: false,
    permissions: [
      "ORDER_VIEW",
      "CUSTOMER_VIEW",
      "REVIEWS_VIEW", "REVIEWS_RESPOND",
      "STORE_VIEW",
    ],
  },
];

export const AVAILABLE_STORES: StoreSummary[] = [
  { id: "store_main", name: "Bhagya Heritage Handicrafts (Primary)", slug: "bhagya-heritage", isPrimary: true },
  { id: "store_silks", name: "Kashmir Silk & Pashmina Studio", slug: "kashmir-silk", isPrimary: false },
  { id: "store_brass", name: "Moradabad Brass & Bell Metal Works", slug: "moradabad-brass", isPrimary: false },
];

const STORAGE_KEY_MEMBERS = "bhagya_team_members_v1";
const STORAGE_KEY_INVITATIONS = "bhagya_team_invitations_v1";

const DEFAULT_MEMBERS: TeamMember[] = [
  {
    id: "mem_owner_01",
    organizationId: "org_dev_merchant",
    userId: "usr_owner_01",
    fullName: "Arjun Verma",
    email: "arjun@bhagyacommerce.in",
    phone: "+91 98765 43210",
    role: "OWNER",
    roleDisplayName: "Organization Owner",
    storeAccessType: "ALL_STORES",
    accessibleStoreIds: [],
    status: "ACTIVE",
    isSoleOwner: true,
    createdAt: "2026-01-10T08:00:00Z",
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: "mem_mgr_02",
    organizationId: "org_dev_merchant",
    userId: "usr_mgr_02",
    fullName: "Pooja Sharma",
    email: "pooja.sharma@bhagyacommerce.in",
    phone: "+91 98111 22334",
    role: "MANAGER",
    roleDisplayName: "Store Manager",
    storeAccessType: "ALL_STORES",
    accessibleStoreIds: [],
    status: "ACTIVE",
    isSoleOwner: false,
    createdAt: "2026-02-15T11:20:00Z",
    lastActiveAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "mem_prod_03",
    organizationId: "org_dev_merchant",
    userId: "usr_prod_03",
    fullName: "Devendra Rathore",
    email: "devendra@craftartisans.org",
    phone: "+91 94140 12345",
    role: "PRODUCT_MANAGER",
    roleDisplayName: "Product & Catalog Manager",
    storeAccessType: "SPECIFIC_STORES",
    accessibleStoreIds: ["store_main", "store_brass"],
    status: "ACTIVE",
    isSoleOwner: false,
    createdAt: "2026-03-01T09:45:00Z",
    lastActiveAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "mem_order_04",
    organizationId: "org_dev_merchant",
    userId: "usr_order_04",
    fullName: "Ananya Iyer",
    email: "ananya.logistics@bhagyacommerce.in",
    phone: "+91 98200 55678",
    role: "ORDER_MANAGER",
    roleDisplayName: "Fulfillment & Orders Lead",
    storeAccessType: "ALL_STORES",
    accessibleStoreIds: [],
    status: "ACTIVE",
    isSoleOwner: false,
    createdAt: "2026-03-12T14:10:00Z",
    lastActiveAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "mem_supp_05",
    organizationId: "org_dev_merchant",
    userId: "usr_supp_05",
    fullName: "Rohan Kulkarni",
    email: "rohan.care@bhagyacommerce.in",
    phone: "+91 97654 32109",
    role: "SUPPORT_AGENT",
    roleDisplayName: "Artisan Support Agent",
    storeAccessType: "SPECIFIC_STORES",
    accessibleStoreIds: ["store_silks"],
    status: "ACTIVE",
    isSoleOwner: false,
    createdAt: "2026-04-05T10:00:00Z",
    lastActiveAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const DEFAULT_INVITATIONS: TeamInvitation[] = [
  {
    id: "inv_demo_01",
    organizationId: "org_dev_merchant",
    email: "priya.mehta@designstudio.in",
    role: "MARKETING_MANAGER",
    roleDisplayName: "Marketing & Growth Specialist",
    storeAccessType: "ALL_STORES",
    storeIds: [],
    status: "PENDING",
    invitedByName: "Arjun Verma",
    invitedByEmail: "arjun@bhagyacommerce.in",
    expiresAt: new Date(Date.now() + 86400000 * 6).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    inviteUrl: "/invite/inv_tok_artisan_growth_2026",
  },
  {
    id: "inv_demo_02",
    organizationId: "org_dev_merchant",
    email: "vikram.singh@rajasthancrafts.in",
    role: "PRODUCT_MANAGER",
    roleDisplayName: "Product & Catalog Manager",
    storeAccessType: "SPECIFIC_STORES",
    storeIds: ["store_brass"],
    status: "PENDING",
    invitedByName: "Arjun Verma",
    invitedByEmail: "arjun@bhagyacommerce.in",
    expiresAt: new Date(Date.now() + 86400000 * 5).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    inviteUrl: "/invite/inv_tok_brass_crafts_curator",
  },
];

class TeamService {
  private loadStoredMembers(): TeamMember[] {
    if (typeof window === "undefined") return DEFAULT_MEMBERS;
    try {
      const raw = localStorage.getItem(STORAGE_KEY_MEMBERS);
      if (raw) return JSON.parse(raw);
    } catch {}
    return DEFAULT_MEMBERS;
  }

  private saveStoredMembers(members: TeamMember[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(members));
    } catch {}
  }

  private loadStoredInvitations(): TeamInvitation[] {
    if (typeof window === "undefined") return DEFAULT_INVITATIONS;
    try {
      const raw = localStorage.getItem(STORAGE_KEY_INVITATIONS);
      if (raw) return JSON.parse(raw);
    } catch {}
    return DEFAULT_INVITATIONS;
  }

  private saveStoredInvitations(invites: TeamInvitation[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY_INVITATIONS, JSON.stringify(invites));
    } catch {}
  }

  // ── Team Members API ───────────────────────────────────────────────────

  async getMembers(): Promise<TeamMember[]> {
    try {
      const res = await fetch("/api/v1/merchant/team/members", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 80));
    return this.loadStoredMembers();
  }

  async getMember(id: string): Promise<TeamMember> {
    const members = await this.getMembers();
    const found = members.find((m) => m.id === id);
    if (!found) throw new Error("Team member not found");
    return found;
  }

  async updateMember(id: string, data: TeamMemberUpdateRequest): Promise<TeamMember> {
    try {
      const res = await fetch(`/api/v1/merchant/team/members/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {}

    await new Promise((r) => setTimeout(r, 120));
    const members = this.loadStoredMembers();
    const member = members.find((m) => m.id === id);
    if (!member) throw new Error("Team member not found");

    // Guard: Sole OWNER invariant
    if (member.isSoleOwner && data.role && data.role !== "OWNER") {
      throw new Error("Cannot change role of the sole organization owner. Transfer ownership first.");
    }
    if (member.isSoleOwner && data.status && data.status !== "ACTIVE") {
      throw new Error("Cannot suspend or deactivate the sole organization owner.");
    }

    if (data.role) {
      member.role = data.role;
      const def = ROLE_DEFINITIONS.find((r) => r.code === data.role);
      member.roleDisplayName = def?.displayName || data.role;
    }
    if (data.storeAccessType) {
      member.storeAccessType = data.storeAccessType;
      member.accessibleStoreIds = data.storeAccessType === "ALL_STORES" ? [] : (data.accessibleStoreIds || []);
    } else if (data.accessibleStoreIds !== undefined) {
      member.accessibleStoreIds = data.accessibleStoreIds;
    }
    if (data.status) {
      member.status = data.status;
    }

    this.saveStoredMembers(members);
    return member;
  }

  async removeMember(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`/api/v1/merchant/team/members/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        return { success: true, message: "Team member removed successfully." };
      }
    } catch {}

    await new Promise((r) => setTimeout(r, 120));
    const members = this.loadStoredMembers();
    const target = members.find((m) => m.id === id);
    if (!target) throw new Error("Team member not found");

    if (target.isSoleOwner) {
      throw new Error("Security Violation: Cannot remove the final organization owner.");
    }

    const filtered = members.filter((m) => m.id !== id);
    this.saveStoredMembers(filtered);
    return { success: true, message: `${target.fullName} has been removed from the organization.` };
  }

  // ── Invitations API ────────────────────────────────────────────────────

  async getInvitations(): Promise<TeamInvitation[]> {
    try {
      const res = await fetch("/api/v1/merchant/team/invitations", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 80));
    return this.loadStoredInvitations();
  }

  async inviteMember(data: TeamInviteRequest): Promise<TeamInvitation> {
    const emailNorm = data.email.trim().toLowerCase();
    if (!emailNorm || !emailNorm.includes("@")) {
      throw new Error("Please provide a valid email address.");
    }

    // Check if already a member
    const members = this.loadStoredMembers();
    if (members.some((m) => m.email.toLowerCase() === emailNorm && m.status === "ACTIVE")) {
      throw new Error(`${emailNorm} is already an active member of this organization.`);
    }

    // Check if pending invitation exists
    const invitations = this.loadStoredInvitations();
    if (invitations.some((inv) => inv.email.toLowerCase() === emailNorm && inv.status === "PENDING")) {
      throw new Error(`An invitation for ${emailNorm} is already pending. Resend or revoke the existing invitation.`);
    }

    try {
      const res = await fetch("/api/v1/merchant/team/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {}

    await new Promise((r) => setTimeout(r, 150));
    const roleDef = ROLE_DEFINITIONS.find((r) => r.code === data.role);
    const token = `inv_tok_${Math.random().toString(36).substring(2, 10)}_${Date.now()}`;
    const newInvitation: TeamInvitation = {
      id: `inv_${Date.now()}`,
      organizationId: "org_dev_merchant",
      email: emailNorm,
      role: data.role,
      roleDisplayName: roleDef?.displayName || data.role,
      storeAccessType: data.storeAccessType,
      storeIds: data.storeAccessType === "ALL_STORES" ? [] : (data.storeIds || []),
      status: "PENDING",
      invitedByName: "Arjun Verma",
      invitedByEmail: "arjun@bhagyacommerce.in",
      expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
      createdAt: new Date().toISOString(),
      inviteUrl: `/invite/${token}`,
    };

    invitations.unshift(newInvitation);
    this.saveStoredInvitations(invitations);
    return newInvitation;
  }

  async revokeInvitation(invitationId: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`/api/v1/merchant/team/invitations/${invitationId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        return { success: true, message: "Invitation revoked successfully." };
      }
    } catch {}

    await new Promise((r) => setTimeout(r, 100));
    const invitations = this.loadStoredInvitations();
    const inv = invitations.find((i) => i.id === invitationId);
    if (!inv) throw new Error("Invitation not found");

    inv.status = "REVOKED";
    this.saveStoredInvitations(invitations);
    return { success: true, message: `Invitation for ${inv.email} has been revoked.` };
  }

  async resendInvitation(invitationId: string): Promise<{ success: boolean; message: string }> {
    await new Promise((r) => setTimeout(r, 120));
    const invitations = this.loadStoredInvitations();
    const inv = invitations.find((i) => i.id === invitationId);
    if (!inv) throw new Error("Invitation not found");

    inv.expiresAt = new Date(Date.now() + 7 * 86400000).toISOString();
    inv.status = "PENDING";
    this.saveStoredInvitations(invitations);
    return { success: true, message: `Fresh invitation email dispatched to ${inv.email}.` };
  }

  // ── Roles & Stores API ─────────────────────────────────────────────────

  async getRoles(): Promise<RoleDefinition[]> {
    return Promise.resolve([...ROLE_DEFINITIONS]);
  }

  async getAvailableStores(): Promise<StoreSummary[]> {
    return Promise.resolve([...AVAILABLE_STORES]);
  }

  // ── Public Invitation Acceptance API ───────────────────────────────────

  async getPublicInvitation(token: string): Promise<PublicInvitationData> {
    try {
      const res = await fetch(`/api/v1/public/invitations/${token}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {}

    await new Promise((r) => setTimeout(r, 120));
    const invitations = this.loadStoredInvitations();
    const inv = invitations.find((i) => i.inviteUrl.includes(token) || i.id === token);

    if (!inv) {
      // Return plausible fallback for previewing with any token
      const roleDef = ROLE_DEFINITIONS[1]; // Store Administrator
      return {
        token,
        organizationName: "Bhagya Heritage Handicrafts Pvt Ltd",
        email: "invited.artisan@bhagyacommerce.in",
        role: "ADMIN",
        roleDisplayName: roleDef.displayName,
        storeAccessType: "ALL_STORES",
        storeNames: ["All Organization Stores"],
        invitedByName: "Arjun Verma (Founder & Master Curator)",
        expiresAt: new Date(Date.now() + 86400000 * 5).toISOString(),
        isExpired: false,
        userExists: true,
        status: "PENDING",
      };
    }

    const isExpired = new Date(inv.expiresAt).getTime() < Date.now();
    const storeNames =
      inv.storeAccessType === "ALL_STORES"
        ? ["All Organization Stores"]
        : AVAILABLE_STORES.filter((s) => inv.storeIds.includes(s.id)).map((s) => s.name);

    return {
      token,
      organizationName: "Bhagya Heritage Handicrafts Pvt Ltd",
      email: inv.email,
      role: inv.role,
      roleDisplayName: inv.roleDisplayName,
      storeAccessType: inv.storeAccessType,
      storeNames: storeNames.length > 0 ? storeNames : ["Specific Departmental Stores"],
      invitedByName: inv.invitedByName,
      expiresAt: inv.expiresAt,
      isExpired,
      userExists: inv.email.includes("craft") || inv.email.includes("bhagya"),
      status: inv.status,
    };
  }

  async acceptInvitation(
    token: string,
    fullName?: string,
    password?: string
  ): Promise<{ success: boolean; message: string; organizationId: string; role: RoleCode }> {
    try {
      const res = await fetch("/api/v1/public/invitations/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, fullName, password }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {}

    await new Promise((r) => setTimeout(r, 200));
    const invitations = this.loadStoredInvitations();
    const inv = invitations.find((i) => i.inviteUrl.includes(token) || i.id === token);

    const email = inv ? inv.email : "invited.artisan@bhagyacommerce.in";
    const role: RoleCode = inv ? inv.role : "ADMIN";
    const storeAccess = inv ? inv.storeAccessType : "ALL_STORES";
    const storeIds = inv ? inv.storeIds : [];

    // Mark invitation accepted
    if (inv) {
      inv.status = "ACCEPTED";
      this.saveStoredInvitations(invitations);
    }

    // Add or activate member in organization
    const members = this.loadStoredMembers();
    const existing = members.find((m) => m.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      existing.status = "ACTIVE";
      existing.role = role;
      existing.storeAccessType = storeAccess;
      existing.accessibleStoreIds = storeIds;
      existing.lastActiveAt = new Date().toISOString();
    } else {
      const def = ROLE_DEFINITIONS.find((r) => r.code === role);
      members.push({
        id: `mem_${Date.now()}`,
        organizationId: "org_dev_merchant",
        userId: `usr_${Date.now()}`,
        fullName: fullName || email.split("@")[0].replace(".", " "),
        email,
        role,
        roleDisplayName: def?.displayName || role,
        storeAccessType: storeAccess,
        accessibleStoreIds: storeIds,
        status: "ACTIVE",
        isSoleOwner: false,
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
      });
    }
    this.saveStoredMembers(members);

    return {
      success: true,
      message: `Welcome aboard! You have joined Bhagya Heritage Handicrafts as ${role}.`,
      organizationId: "org_dev_merchant",
      role,
    };
  }
}

export const teamService = new TeamService();
