"use client";

import {
  AlertCircle,
  Bell,
  Building2,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  ExternalLink,
  Key,
  Landmark,
  Layers,
  Lock,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  Radio,
  RotateCcw,
  Save,
  Send,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Store,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/auth-context";
import { toast } from "@/lib/toast";

type SettingsTab = "store" | "notifications" | "security" | "team" | "payouts";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Store Manager" | "Fulfillment Specialist" | "Support Agent";
  status: "Active" | "Invited";
  lastActive: string;
}

const INITIAL_TEAM: TeamMember[] = [
  {
    id: "tm_1",
    name: "Shubham Saini",
    email: "shubham@varanasicheritage.com",
    role: "Owner",
    status: "Active",
    lastActive: "Just now",
  },
  {
    id: "tm_2",
    name: "Aarav Sharma",
    email: "aarav.ops@varanasicheritage.com",
    role: "Store Manager",
    status: "Active",
    lastActive: "2 hours ago",
  },
  {
    id: "tm_3",
    name: "Pooja Verma",
    email: "pooja.pack@varanasicheritage.com",
    role: "Fulfillment Specialist",
    status: "Active",
    lastActive: "Yesterday",
  },
];

export function MerchantSettingsView() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState<SettingsTab>("store");
  const [isSaving, setIsSaving] = React.useState(false);
  const [copiedKey, setCopiedKey] = React.useState(false);

  // Store form state
  const [storeName, setStoreName] = React.useState("Varanasi Heritage Silks");
  const [legalEntity, setLegalEntity] = React.useState("Varanasi Heritage Handlooms Pvt Ltd");
  const [gstin, setGstin] = React.useState("09AAACV1234F1Z8");
  const [pan, setPan] = React.useState("AAACV1234F");
  const [businessEmail, setBusinessEmail] = React.useState("support@varanasicheritage.com");
  const [businessPhone, setBusinessPhone] = React.useState("+91 98765 43210");
  const [registeredAddress, setRegisteredAddress] = React.useState("K-45/12, Chowk Ghat, Varanasi, Uttar Pradesh - 221001");
  const [storeCategory, setStoreCategory] = React.useState("Heritage Handlooms & Textiles");

  // Notifications state
  const [notifyEmailOrder, setNotifyEmailOrder] = React.useState(true);
  const [notifyWhatsAppOrder, setNotifyWhatsAppOrder] = React.useState(true);
  const [notifySmsOrder, setNotifySmsOrder] = React.useState(false);
  const [notifyLowStock, setNotifyLowStock] = React.useState(true);
  const [notifyDailyDigest, setNotifyDailyDigest] = React.useState(true);
  const [notifyCustomerQuery, setNotifyCustomerQuery] = React.useState(true);
  const [notifyPayouts, setNotifyPayouts] = React.useState(true);

  // Security state
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(true);
  const [sessionTimeout, setSessionTimeout] = React.useState("24h");

  // Team state
  const [teamMembers, setTeamMembers] = React.useState<TeamMember[]>(INITIAL_TEAM);
  const [showInviteModal, setShowInviteModal] = React.useState(false);
  const [inviteName, setInviteName] = React.useState("");
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteRole, setInviteRole] = React.useState<TeamMember["role"]>("Store Manager");

  const apiKey = "bg_live_8f7b2c9e4a1d5f6e8c0b2a3d4e5f6a7b";

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    toast.success("API Key Copied", "Production publishable key copied to clipboard.");
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success("Settings Saved", "Your store configuration has been securely updated.");
    } catch {
      toast.error("Save Failed", "Could not save settings at this time.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    const newMember: TeamMember = {
      id: `tm_${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      status: "Invited",
      lastActive: "Pending confirmation",
    };

    setTeamMembers((prev) => [...prev, newMember]);
    setInviteName("");
    setInviteEmail("");
    setShowInviteModal(false);
    toast.success("Invitation Sent", `Team invite dispatched to ${newMember.email}`);
  };

  const handleDeleteMember = (id: string) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
    toast.info("Member Removed", "Team member access has been revoked.");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* =========================================================================
          SETTINGS HEADER & STORE HEALTH OVERVIEW
          ========================================================================= */}
      <div className="relative overflow-hidden rounded-2xl border border-[#444139] bg-gradient-to-r from-[#24231F] via-[#2B2A25] to-[#24231F] p-6 sm:p-8 shadow-lg">
        {/* Subtle Ambient Gold Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-full w-full sm:w-1/2 bg-[radial-gradient(circle_at_80%_40%,rgba(196,154,69,0.14),transparent_65%)]"
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill bg-[#35332C] border border-[#5A4725] text-[11px] font-bold text-[#DDBB72] tracking-wider uppercase">
                <Store className="size-3 text-[#C49A45]" />
                Store Control Center
              </span>
              <span className="text-[#9E988C]">·</span>
              <span className="text-xs text-[#C8C1B4]">Merchant Workspace</span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F5F1E8] tracking-tight">
              Settings & Store Operations
            </h1>

            <p className="text-sm text-[#C8C1B4] leading-relaxed">
              Manage your registered legal entity, notification delivery channels, role-based team permissions, security policies, and verified bank payouts.
            </p>
          </div>

          {/* Configuration Health Card */}
          <div className="shrink-0 p-4 rounded-xl border border-[#444139] bg-[#1C1B18]/90 shadow-inner w-full lg:w-72 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#DDBB72] flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-[#43A66A]" />
                Configuration Health
              </span>
              <span className="text-xs font-bold text-[#43A66A]">100% Ready</span>
            </div>

            {/* Health Meter */}
            <div className="h-1.5 w-full rounded-full bg-[#35332C] overflow-hidden">
              <div className="h-full w-full bg-gradient-to-r from-[#C49A45] to-[#43A66A] rounded-full" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-[#C8C1B4] pt-1">
              <div className="flex items-center gap-1">
                <Check className="size-3 text-[#43A66A]" /> Store Profile
              </div>
              <div className="flex items-center gap-1">
                <Check className="size-3 text-[#43A66A]" /> Bank Verified
              </div>
              <div className="flex items-center gap-1">
                <Check className="size-3 text-[#43A66A]" /> 2FA Active
              </div>
              <div className="flex items-center gap-1">
                <Check className="size-3 text-[#43A66A]" /> 3 Active Seats
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TAB NAVIGATION
          ========================================================================= */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#3A3831] scrollbar-none">
        {[
          { id: "store", label: "Store & Legal Details", icon: Building2 },
          { id: "notifications", label: "Notification Channels", icon: Bell },
          { id: "security", label: "Security & API Keys", icon: Shield },
          { id: "team", label: "Team & Permissions", icon: Users },
          { id: "payouts", label: "Payouts & Settlement", icon: Landmark },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                isActive
                  ? "bg-[#302B20] text-[#DDBB72] border border-[#5A4725] shadow-xs"
                  : "text-[#B8B1A5] hover:text-[#F5F1E8] hover:bg-[#2B2923]"
              }`}
            >
              <Icon className={`size-4 ${isActive ? "text-[#C49A45]" : "text-[#9E988C]"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB CONTENT PANELS
          ========================================================================= */}

      {/* -------------------------------------------------------------------------
          1. STORE & LEGAL DETAILS TAB
          ------------------------------------------------------------------------- */}
      {activeTab === "store" && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <Card variant="surface" padding="none" radius="xl" className="border-[#444139] bg-[#2B2A25] shadow-md overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-[#3A3831] bg-[#24231F] flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-[#F5F1E8] flex items-center gap-2">
                  <Building2 className="size-4 text-[#C49A45]" />
                  Registered Business Profile
                </h3>
                <p className="text-xs text-[#C8C1B4]">
                  Legal entity documentation and merchant compliance details.
                </p>
              </div>
              <Badge tone="success" size="sm" className="bg-[#294C38] text-[#73D393] border-none">
                KYC Verified
              </Badge>
            </div>

            <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F5F1E8]">Display Store Name</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full rounded-xl border border-[#444139] bg-[#24231F] px-3.5 py-2.5 text-sm text-[#F5F1E8] focus:border-[#C49A45] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F5F1E8]">Legal Business Entity</label>
                <input
                  type="text"
                  value={legalEntity}
                  onChange={(e) => setLegalEntity(e.target.value)}
                  className="w-full rounded-xl border border-[#444139] bg-[#24231F] px-3.5 py-2.5 text-sm text-[#F5F1E8] focus:border-[#C49A45] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F5F1E8]">GSTIN (Goods & Services Tax ID)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full rounded-xl border border-[#444139] bg-[#24231F] px-3.5 py-2.5 text-sm font-mono text-[#F5F1E8] focus:border-[#C49A45] focus:outline-none"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-[#43A66A] font-bold">✓ Valid</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F5F1E8]">Business PAN Number</label>
                <input
                  type="text"
                  value={pan}
                  onChange={(e) => setPan(e.target.value)}
                  className="w-full rounded-xl border border-[#444139] bg-[#24231F] px-3.5 py-2.5 text-sm font-mono text-[#F5F1E8] focus:border-[#C49A45] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F5F1E8]">Support & Order Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 size-4 text-[#9E988C]" />
                  <input
                    type="email"
                    value={businessEmail}
                    onChange={(e) => setBusinessEmail(e.target.value)}
                    className="w-full rounded-xl border border-[#444139] bg-[#24231F] pl-10 pr-3.5 py-2.5 text-sm text-[#F5F1E8] focus:border-[#C49A45] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F5F1E8]">Support Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 size-4 text-[#9E988C]" />
                  <input
                    type="text"
                    value={businessPhone}
                    onChange={(e) => setBusinessPhone(e.target.value)}
                    className="w-full rounded-xl border border-[#444139] bg-[#24231F] pl-10 pr-3.5 py-2.5 text-sm text-[#F5F1E8] focus:border-[#C49A45] focus:outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-[#F5F1E8]">Registered Operating Address</label>
                <textarea
                  rows={2}
                  value={registeredAddress}
                  onChange={(e) => setRegisteredAddress(e.target.value)}
                  className="w-full rounded-xl border border-[#444139] bg-[#24231F] px-3.5 py-2.5 text-sm text-[#F5F1E8] focus:border-[#C49A45] focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="p-4 sm:p-5 border-t border-[#3A3831] bg-[#24231F] flex items-center justify-between">
              <span className="text-xs text-[#9E988C]">
                Changes will take effect across public store receipts and invoices.
              </span>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isSaving}
                className="bg-[#C49A45] hover:bg-[#DDBB72] text-[#151515] font-semibold gap-2"
              >
                {isSaving ? <RotateCcw className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                <span>Save Store Profile</span>
              </Button>
            </div>
          </Card>
        </form>
      )}

      {/* -------------------------------------------------------------------------
          2. NOTIFICATION CHANNELS TAB
          ------------------------------------------------------------------------- */}
      {activeTab === "notifications" && (
        <div className="space-y-6">
          {/* Notification Channels Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border border-[#444139] bg-[#2B2A25] space-y-2">
              <div className="flex items-center justify-between">
                <div className="size-8 rounded-lg bg-[#35332C] grid place-items-center text-[#C49A45]">
                  <Mail className="size-4" />
                </div>
                <Badge tone="success" size="sm" className="bg-[#294C38] text-[#73D393] border-none">
                  Active
                </Badge>
              </div>
              <h4 className="text-sm font-bold text-[#F5F1E8]">Email Dispatch</h4>
              <p className="text-xs text-[#C8C1B4]">
                Instant transaction invoices, daily digest summaries & settlement alerts.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-[#444139] bg-[#2B2A25] space-y-2">
              <div className="flex items-center justify-between">
                <div className="size-8 rounded-lg bg-[#35332C] grid place-items-center text-[#43A66A]">
                  <MessageSquare className="size-4" />
                </div>
                <Badge tone="success" size="sm" className="bg-[#294C38] text-[#73D393] border-none">
                  Connected
                </Badge>
              </div>
              <h4 className="text-sm font-bold text-[#F5F1E8]">WhatsApp Alerts</h4>
              <p className="text-xs text-[#C8C1B4]">
                Real-time high-priority order alerts & dispatch status via WhatsApp Bot.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-[#444139] bg-[#2B2A25] space-y-2">
              <div className="flex items-center justify-between">
                <div className="size-8 rounded-lg bg-[#35332C] grid place-items-center text-[#DDBB72]">
                  <Smartphone className="size-4" />
                </div>
                <Badge tone="neutral" size="sm" className="bg-[#34322B] text-[#C8C1B4] border-none">
                  Optional
                </Badge>
              </div>
              <h4 className="text-sm font-bold text-[#F5F1E8]">SMS Gateway</h4>
              <p className="text-xs text-[#C8C1B4]">
                Emergency fallback OTPs and fulfillment delay warnings.
              </p>
            </div>
          </div>

          {/* Preferences Toggle List */}
          <Card variant="surface" padding="none" radius="xl" className="border-[#444139] bg-[#2B2A25] shadow-md overflow-hidden">
            <div className="p-5 border-b border-[#3A3831] bg-[#24231F]">
              <h3 className="text-base font-bold text-[#F5F1E8] flex items-center gap-2">
                <Bell className="size-4 text-[#C49A45]" />
                Event Alert Preferences
              </h3>
              <p className="text-xs text-[#C8C1B4]">
                Configure when and where your team receives notifications.
              </p>
            </div>

            <div className="divide-y divide-[#3A3831]">
              <div className="p-5 flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-sm font-bold text-[#F5F1E8] block">New Order Landed</span>
                  <span className="text-xs text-[#C8C1B4]">
                    Dispatch immediate notification via Email & WhatsApp as soon as customer checkout completes.
                  </span>
                </div>
                <Switch checked={notifyEmailOrder} onCheckedChange={setNotifyEmailOrder} />
              </div>

              <div className="p-5 flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-sm font-bold text-[#F5F1E8] block">Low Stock & Reorder Thresholds</span>
                  <span className="text-xs text-[#C8C1B4]">
                    Alert when any artisan SKU drops below 5 units to prevent inventory depletion.
                  </span>
                </div>
                <Switch checked={notifyLowStock} onCheckedChange={setNotifyLowStock} />
              </div>

              <div className="p-5 flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-sm font-bold text-[#F5F1E8] block">Daily Evening Sales Digest</span>
                  <span className="text-xs text-[#C8C1B4]">
                    Comprehensive 9:00 PM summary of today's gross revenue, net payout, and dispatch volume.
                  </span>
                </div>
                <Switch checked={notifyDailyDigest} onCheckedChange={setNotifyDailyDigest} />
              </div>

              <div className="p-5 flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-sm font-bold text-[#F5F1E8] block">Customer Inquiry & Support Chat</span>
                  <span className="text-xs text-[#C8C1B4]">
                    Direct notification when a buyer leaves a message or customization request.
                  </span>
                </div>
                <Switch checked={notifyCustomerQuery} onCheckedChange={setNotifyCustomerQuery} />
              </div>

              <div className="p-5 flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-sm font-bold text-[#F5F1E8] block">Settlement & Bank Transfers</span>
                  <span className="text-xs text-[#C8C1B4]">
                    Notification with NEFT/RTGS UTR number when daily payout is deposited.
                  </span>
                </div>
                <Switch checked={notifyPayouts} onCheckedChange={setNotifyPayouts} />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* -------------------------------------------------------------------------
          3. SECURITY & API KEYS TAB
          ------------------------------------------------------------------------- */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <Card variant="surface" padding="none" radius="xl" className="border-[#444139] bg-[#2B2A25] shadow-md overflow-hidden">
            <div className="p-5 border-b border-[#3A3831] bg-[#24231F] flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-[#F5F1E8] flex items-center gap-2">
                  <ShieldCheck className="size-4 text-[#43A66A]" />
                  Authentication & Account Protection
                </h3>
                <p className="text-xs text-[#C8C1B4]">
                  Two-factor authentication and session lifecycle management.
                </p>
              </div>
              <Badge tone="success" size="sm" className="bg-[#294C38] text-[#73D393] border-none">
                Protected
              </Badge>
            </div>

            <div className="p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between p-4 rounded-xl border border-[#444139] bg-[#24231F]">
                <div className="space-y-1">
                  <span className="text-sm font-bold text-[#F5F1E8] flex items-center gap-2">
                    <Lock className="size-4 text-[#C49A45]" />
                    Two-Factor Authentication (2FA)
                  </span>
                  <span className="text-xs text-[#C8C1B4] block">
                    Require OTP verification on merchant login and sensitive payout modifications.
                  </span>
                </div>
                <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#9E988C]">
                  Active Management Sessions
                </h4>
                <div className="rounded-xl border border-[#444139] divide-y divide-[#3A3831] bg-[#24231F]">
                  <div className="p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-[#35332C] grid place-items-center text-[#43A66A]">
                        <Server className="size-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#F5F1E8] block">Current Browser (Windows / Chrome)</span>
                        <span className="text-[11px] text-[#9E988C]">IP: 103.212.43.19 • Varanasi, India</span>
                      </div>
                    </div>
                    <Badge tone="success" size="sm" className="bg-[#294C38] text-[#73D393]">
                      Active Now
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* API Keys & Webhook Access */}
          <Card variant="surface" padding="none" radius="xl" className="border-[#444139] bg-[#2B2A25] shadow-md overflow-hidden">
            <div className="p-5 border-b border-[#3A3831] bg-[#24231F]">
              <h3 className="text-base font-bold text-[#F5F1E8] flex items-center gap-2">
                <Key className="size-4 text-[#C49A45]" />
                Storefront API & Webhooks
              </h3>
              <p className="text-xs text-[#C8C1B4]">
                Production keys for ERP, shipping aggregators (Shiprocket) and inventory sync.
              </p>
            </div>

            <div className="p-5 sm:p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F5F1E8]">Publishable API Token</label>
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    readOnly
                    value={apiKey}
                    className="flex-1 rounded-xl border border-[#444139] bg-[#24231F] px-3.5 py-2.5 text-sm font-mono text-[#F5F1E8] focus:outline-none"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopyKey}
                    className="bg-[#2B2A25] border-[#444139] text-[#F5F1E8] hover:bg-[#34322B] hover:border-[#C49A45] gap-1.5 h-10 px-3.5"
                  >
                    {copiedKey ? <Check className="size-3.5 text-[#43A66A]" /> : <Copy className="size-3.5 text-[#C49A45]" />}
                    <span>{copiedKey ? "Copied" : "Copy Key"}</span>
                  </Button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-[#5A4725]/60 bg-[#1C1B18] text-xs text-[#C8C1B4] flex items-start gap-2.5">
                <ShieldAlert className="size-4 text-[#DDBB72] shrink-0 mt-0.5" />
                <span>
                  Never expose your secret keys in client-side code. Bhagya AI and merchant services use tokenized server-side proxying.
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* -------------------------------------------------------------------------
          4. TEAM & PERMISSIONS TAB
          ------------------------------------------------------------------------- */}
      {activeTab === "team" && (
        <div className="space-y-6">
          <Card variant="surface" padding="none" radius="xl" className="border-[#444139] bg-[#2B2A25] shadow-md overflow-hidden">
            <div className="p-5 border-b border-[#3A3831] bg-[#24231F] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-[#F5F1E8] flex items-center gap-2">
                  <Users className="size-4 text-[#C49A45]" />
                  Staff Members & Role Access
                </h3>
                <p className="text-xs text-[#C8C1B4]">
                  Invite teammates with granular roles for catalog, warehouse packing, and analytics.
                </p>
              </div>

              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setShowInviteModal(true)}
                className="bg-[#C49A45] hover:bg-[#DDBB72] text-[#151515] font-semibold gap-1.5"
              >
                <UserPlus className="size-3.5" />
                <span>Invite Member</span>
              </Button>
            </div>

            {/* Team Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#3A3831] bg-[#1C1B18]/60 text-[11px] font-bold uppercase tracking-wider text-[#9E988C]">
                    <th className="py-3 px-5">Member Name</th>
                    <th className="py-3 px-5">Assigned Role</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5">Last Activity</th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3A3831] text-xs">
                  {teamMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-[#34322B]/60 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2.5">
                          <div className="size-8 rounded-full bg-[#35332C] border border-[#5A4725] text-[#DDBB72] font-bold text-xs grid place-items-center">
                            {member.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-[#F5F1E8] block">{member.name}</span>
                            <span className="text-[11px] text-[#9E988C]">{member.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#35332C] text-[#F5F1E8] border border-[#444139] font-medium">
                          {member.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          member.status === "Active" ? "bg-[#294C38] text-[#73D393]" : "bg-[#4A3B24] text-[#DDBB72]"
                        }`}>
                          <span className={`size-1.5 rounded-full ${member.status === "Active" ? "bg-[#43A66A]" : "bg-[#C79338]"}`} />
                          {member.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-[#C8C1B4]">{member.lastActive}</td>
                      <td className="py-3.5 px-5 text-right">
                        {member.role !== "Owner" ? (
                          <button
                            type="button"
                            onClick={() => handleDeleteMember(member.id)}
                            title="Remove access"
                            className="p-1.5 rounded-lg text-[#9E988C] hover:text-[#D05A4A] hover:bg-[#4A2924] transition-colors"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        ) : (
                          <span className="text-[11px] text-[#9E988C] italic">Primary Admin</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Invite Modal */}
          {showInviteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
              <div className="w-full max-w-md rounded-2xl border border-[#444139] bg-[#2B2A25] p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#3A3831]">
                  <h4 className="text-base font-bold text-[#F5F1E8] flex items-center gap-2">
                    <UserPlus className="size-4 text-[#C49A45]" />
                    Invite Teammate
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="text-[#9E988C] hover:text-[#F5F1E8]"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleInviteMember} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#F5F1E8]">Full Name</label>
                    <input
                      type="text"
                      required
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      placeholder="e.g. Ramesh Patel"
                      className="w-full rounded-xl border border-[#444139] bg-[#24231F] px-3.5 py-2.5 text-sm text-[#F5F1E8] focus:border-[#C49A45] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#F5F1E8]">Email Address</label>
                    <input
                      type="email"
                      required
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="ramesh@store.com"
                      className="w-full rounded-xl border border-[#444139] bg-[#24231F] px-3.5 py-2.5 text-sm text-[#F5F1E8] focus:border-[#C49A45] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#F5F1E8]">Assign Permission Role</label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as TeamMember["role"])}
                      className="w-full rounded-xl border border-[#444139] bg-[#24231F] px-3.5 py-2.5 text-sm text-[#F5F1E8] focus:border-[#C49A45] focus:outline-none"
                    >
                      <option value="Store Manager">Store Manager (Products, Orders, Marketing)</option>
                      <option value="Fulfillment Specialist">Fulfillment Specialist (Orders & Dispatch only)</option>
                      <option value="Support Agent">Support Agent (Inquiries & Customer chat)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-2.5 pt-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowInviteModal(false)}
                      className="bg-[#24231F] border-[#444139] text-[#C8C1B4] hover:text-[#F5F1E8]"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      className="bg-[#C49A45] hover:bg-[#DDBB72] text-[#151515] font-semibold"
                    >
                      Send Invitation
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* -------------------------------------------------------------------------
          5. PAYOUTS & SETTLEMENT TAB
          ------------------------------------------------------------------------- */}
      {activeTab === "payouts" && (
        <div className="space-y-6">
          <Card variant="surface" padding="none" radius="xl" className="border-[#444139] bg-[#2B2A25] shadow-md overflow-hidden">
            <div className="p-5 border-b border-[#3A3831] bg-[#24231F] flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-[#F5F1E8] flex items-center gap-2">
                  <Landmark className="size-4 text-[#C49A45]" />
                  Designated Settlement Bank Account
                </h3>
                <p className="text-xs text-[#C8C1B4]">
                  All order net proceeds are automatically settled daily (T+1).
                </p>
              </div>
              <Badge tone="success" size="sm" className="bg-[#294C38] text-[#73D393] border-none">
                Penny Drop Verified
              </Badge>
            </div>

            <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-4 rounded-xl border border-[#444139] bg-[#24231F] space-y-1">
                <span className="text-[11px] text-[#9E988C] uppercase tracking-wider block">Beneficiary Name</span>
                <span className="text-sm font-bold text-[#F5F1E8]">Varanasi Heritage Handlooms Pvt Ltd</span>
              </div>

              <div className="p-4 rounded-xl border border-[#444139] bg-[#24231F] space-y-1">
                <span className="text-[11px] text-[#9E988C] uppercase tracking-wider block">Bank & Branch</span>
                <span className="text-sm font-bold text-[#F5F1E8]">HDFC Bank Ltd • Chowk Branch, Varanasi</span>
              </div>

              <div className="p-4 rounded-xl border border-[#444139] bg-[#24231F] space-y-1">
                <span className="text-[11px] text-[#9E988C] uppercase tracking-wider block">Account Number</span>
                <span className="text-sm font-mono font-bold text-[#F5F1E8]">•••• •••• •••• 4829</span>
              </div>

              <div className="p-4 rounded-xl border border-[#444139] bg-[#24231F] space-y-1">
                <span className="text-[11px] text-[#9E988C] uppercase tracking-wider block">IFSC Code</span>
                <span className="text-sm font-mono font-bold text-[#F5F1E8]">HDFC0001248</span>
              </div>
            </div>

            <div className="p-4 sm:p-5 border-t border-[#3A3831] bg-[#1C1B18] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[#C8C1B4]">
                <ShieldCheck className="size-4 text-[#43A66A]" />
                <span>Settlement Cycle: <strong className="text-[#DDBB72]">T+1 Banking Day (Daily auto-credit)</strong></span>
              </div>
            </div>
          </Card>

          {/* Recent Settlement Transactions */}
          <Card variant="surface" padding="none" radius="xl" className="border-[#444139] bg-[#2B2A25] shadow-md overflow-hidden">
            <div className="p-5 border-b border-[#3A3831] bg-[#24231F]">
              <h3 className="text-base font-bold text-[#F5F1E8] flex items-center gap-2">
                <CreditCard className="size-4 text-[#C49A45]" />
                Recent Daily Settlements
              </h3>
              <p className="text-xs text-[#C8C1B4]">
                Direct automated payouts credited to your verified bank account.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#3A3831] bg-[#1C1B18]/60 text-[11px] font-bold uppercase tracking-wider text-[#9E988C]">
                    <th className="py-3 px-5">Settlement Date</th>
                    <th className="py-3 px-5">UTR / Reference ID</th>
                    <th className="py-3 px-5">Order Count</th>
                    <th className="py-3 px-5">Net Transferred</th>
                    <th className="py-3 px-5 text-right">Transfer Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3A3831] text-xs">
                  {[
                    { date: "25 Sep 2026", utr: "HDFCN2626849102", count: 18, amount: 48600, status: "Credited" },
                    { date: "24 Sep 2026", utr: "HDFCN2625738291", count: 22, amount: 59400, status: "Credited" },
                    { date: "23 Sep 2026", utr: "HDFCN2624629183", count: 15, amount: 41250, status: "Credited" },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#34322B]/60 transition-colors">
                      <td className="py-3.5 px-5 font-medium text-[#F5F1E8]">{row.date}</td>
                      <td className="py-3.5 px-5 font-mono text-[#DDBB72]">{row.utr}</td>
                      <td className="py-3.5 px-5 text-[#C8C1B4]">{row.count} orders</td>
                      <td className="py-3.5 px-5 font-bold text-[#F5F1E8]">₹{row.amount.toLocaleString("en-IN")}</td>
                      <td className="py-3.5 px-5 text-right">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#294C38] text-[#73D393]">
                          <CheckCircle2 className="size-3" />
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
