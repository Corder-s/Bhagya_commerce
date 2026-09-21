import {
  Boxes,
  ChartLine,
  Compass,
  Heart,
  House,
  LayoutDashboard,
  MapPin,
  Megaphone,
  Package,
  ReceiptIndianRupee,
  Search,
  Settings,
  Settings2,
  ShoppingBag,
  Sparkles,
  Store,
  UserRound,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import * as React from "react";

import type { NavIconName, NavIconMap } from "@/types/navigation";

/**
 * Icon registry for navigation config.
 *
 * Icons are imported individually (never `import * as icons`) so the bundler can
 * tree-shake: the union in `types/navigation.ts` and this map are the only two
 * places that need to change when a nav item gains an icon.
 */
const navIcons: NavIconMap = {
  Search,
  Heart,
  ShoppingBag,
  UserRound,
  House,
  Compass,
  Package,
  LayoutDashboard,
  ReceiptIndianRupee,
  Boxes,
  Users,
  ChartLine,
  Megaphone,
  Sparkles,
  Store,
  Settings,
  Settings2,
  MapPin,
};

export function getNavIcon(name: NavIconName): LucideIcon {
  return navIcons[name];
}

export function NavIcon({
  name,
  className,
  strokeWidth = 1.75,
  ...props
}: Omit<React.ComponentProps<"svg">, "name"> & {
  name: NavIconName;
  strokeWidth?: number;
}) {
  const Icon = navIcons[name];
  return (
    <Icon aria-hidden="true" className={className} strokeWidth={strokeWidth} {...props} />
  );
}
