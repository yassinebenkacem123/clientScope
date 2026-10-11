import type { DashboardRoute } from "./navigation-config";

export function isNavigationItemActive(pathname: string, href: DashboardRoute) {
  if (href === "/dashboard") return pathname === href;

  return pathname === href || pathname.startsWith(`${href}/`);
}
