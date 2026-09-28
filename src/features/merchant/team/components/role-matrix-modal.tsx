"use client";

import { Check, ShieldCheck, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  ROLE_DEFINITIONS,
  type PermissionCode,
  type RoleCode,
} from "@/services/team.service";

interface RoleMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PermissionCategory {
  title: string;
  permissions: { code: PermissionCode; label: string; desc: string }[];
}

const PERMISSION_CATEGORIES: PermissionCategory[] = [
  {
    title: "Catalog & Inventory",
    permissions: [
      { code: "PRODUCT_VIEW", label: "View Products", desc: "Browse listings, pricing, and stock" },
      { code: "PRODUCT_CREATE", label: "Create Products", desc: "Draft craft items and collections" },
      { code: "PRODUCT_UPDATE", label: "Edit Products", desc: "Modify prices, stories, and inventory levels" },
      { code: "PRODUCT_DELETE", label: "Delete Products", desc: "Remove craft items permanently" },
      { code: "INVENTORY_VIEW", label: "View Inventory", desc: "Monitor warehouse stocks and safety stock" },
      { code: "INVENTORY_UPDATE", label: "Adjust Stock", desc: "Record batch replenishments and stock takes" },
    ],
  },
  {
    title: "Orders & Shipping",
    permissions: [
      { code: "ORDER_VIEW", label: "View Orders", desc: "Inspect buyer orders and customer addresses" },
      { code: "ORDER_UPDATE", label: "Process Orders", desc: "Mark orders confirmed, packed, and manifest" },
      { code: "ORDER_CANCEL", label: "Cancel Orders", desc: "Void pending orders upon customer request" },
      { code: "ORDER_REFUND", label: "Issue Refunds", desc: "Authorize full or partial Razorpay refunds" },
      { code: "SHIPPING_VIEW", label: "Track Shipments", desc: "Monitor Shiprocket and Delhivery parcels" },
      { code: "SHIPPING_MANAGE", label: "Generate Waybills", desc: "Book couriers and download shipping labels" },
    ],
  },
  {
    title: "Customer Support & Reviews",
    permissions: [
      { code: "CUSTOMER_VIEW", label: "View Customers", desc: "View customer profiles and purchase history" },
      { code: "REVIEWS_VIEW", label: "View Reviews", desc: "Read verified customer craft feedback" },
      { code: "REVIEWS_MODERATE", label: "Moderate Reviews", desc: "Flag spam or approve spotlight testimonials" },
      { code: "REVIEWS_RESPOND", label: "Reply to Reviews", desc: "Post public replies on behalf of the artisan studio" },
    ],
  },
  {
    title: "Marketing & Growth",
    permissions: [
      { code: "MARKETING_VIEW", label: "View Campaigns", desc: "Inspect discount coupons and promotions" },
      { code: "MARKETING_CREATE", label: "Create Vouchers", desc: "Generate festival discount codes" },
      { code: "MARKETING_UPDATE", label: "Edit Campaigns", desc: "Update promotion rules and banner banners" },
      { code: "ANALYTICS_VIEW", label: "Sales Analytics", desc: "Analyze revenue, GMV, and conversion funnel" },
    ],
  },
  {
    title: "Storefront & Domains",
    permissions: [
      { code: "STOREFRONT_VIEW", label: "Preview Storefront", desc: "Inspect draft customized pages" },
      { code: "STOREFRONT_UPDATE", label: "Edit Layout & Theme", desc: "Reorder blocks, customize typography" },
      { code: "STOREFRONT_PUBLISH", label: "Publish Revisions", desc: "Deploy live storefront updates to shoppers" },
      { code: "STORE_VIEW", label: "View Store Info", desc: "View store details and business profiles" },
      { code: "STORE_UPDATE", label: "Update Store Info", desc: "Update GSTIN, legal name, and contact details" },
    ],
  },
  {
    title: "Team & Organization Governance",
    permissions: [
      { code: "TEAM_VIEW", label: "View Team", desc: "Browse member list and invitation statuses" },
      { code: "TEAM_INVITE", label: "Invite Members", desc: "Dispatch email invitations with roles" },
      { code: "TEAM_UPDATE", label: "Update Roles", desc: "Change store scopes or member statuses" },
      { code: "TEAM_REMOVE", label: "Remove Members", desc: "Revoke team access from organization" },
    ],
  },
  {
    title: "SaaS Billing & Subscriptions",
    permissions: [
      { code: "BILLING_VIEW", label: "View Billing", desc: "Inspect SaaS invoices and subscription plan" },
      { code: "BILLING_MANAGE", label: "Manage Plan", desc: "Upgrade plan, update card, or change cycle" },
    ],
  },
];

const ROLES: RoleCode[] = [
  "OWNER",
  "ADMIN",
  "MANAGER",
  "PRODUCT_MANAGER",
  "ORDER_MANAGER",
  "MARKETING_MANAGER",
  "SUPPORT_AGENT",
];

export function RoleMatrixModal({ isOpen, onClose }: RoleMatrixModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-5xl rounded-2xl border border-stone-200 bg-stone-50 p-6 shadow-2xl dark:border-stone-800 dark:bg-stone-900 md:p-8 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100">
                Roles & Granular Permissions Matrix
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Authoritative permission mapping across all 7 Bhagya Commerce organization roles
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-stone-400 hover:bg-stone-200 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Roles Quick Header */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {ROLE_DEFINITIONS.map((r) => (
            <div
              key={r.code}
              className="rounded-xl border border-stone-200 bg-white p-2.5 dark:border-stone-800 dark:bg-stone-850"
            >
              <div className="text-[11px] font-bold text-stone-900 dark:text-stone-100 truncate">
                {r.displayName}
              </div>
              <div className="text-[9px] uppercase tracking-wider text-amber-700 dark:text-amber-400 font-semibold mt-0.5">
                {r.code}
              </div>
              <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">
                {r.description}
              </div>
            </div>
          ))}
        </div>

        {/* Table Matrix */}
        <div className="mt-6 overflow-x-auto rounded-xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-850">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-100/70 dark:border-stone-800 dark:bg-stone-800/50">
                <th className="py-3 px-4 font-semibold text-stone-700 dark:text-stone-300 w-1/3">
                  Permission
                </th>
                {ROLES.map((role) => (
                  <th
                    key={role}
                    className="py-3 px-2 font-semibold text-center text-stone-700 dark:text-stone-300 min-w-[70px]"
                  >
                    <span className="block text-[10px] text-stone-500">{role.split("_")[0]}</span>
                    {role.split("_")[1] || ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {PERMISSION_CATEGORIES.map((cat) => (
                <React.Fragment key={cat.title}>
                  <tr className="bg-stone-50/80 dark:bg-stone-800/30">
                    <td
                      colSpan={ROLES.length + 1}
                      className="py-2 px-4 font-bold text-[11px] uppercase tracking-wider text-stone-600 dark:text-stone-400"
                    >
                      {cat.title}
                    </td>
                  </tr>
                  {cat.permissions.map((perm) => (
                    <tr
                      key={perm.code}
                      className="hover:bg-amber-50/30 dark:hover:bg-amber-950/20 transition-colors"
                    >
                      <td className="py-2.5 px-4">
                        <div className="font-medium text-stone-900 dark:text-stone-100">
                          {perm.label}
                        </div>
                        <div className="text-[10px] text-stone-500 dark:text-stone-400">
                          {perm.desc}
                        </div>
                      </td>
                      {ROLES.map((roleCode) => {
                        const roleDef = ROLE_DEFINITIONS.find((r) => r.code === roleCode);
                        const hasPerm = roleDef?.permissions.includes(perm.code);
                        return (
                          <td key={roleCode} className="py-2.5 px-2 text-center">
                            {hasPerm ? (
                              <div className="inline-flex size-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                                <Check className="size-3 stroke-[3]" />
                              </div>
                            ) : (
                              <span className="text-stone-300 dark:text-stone-700">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close Matrix
          </Button>
        </div>
      </div>
    </div>
  );
}
