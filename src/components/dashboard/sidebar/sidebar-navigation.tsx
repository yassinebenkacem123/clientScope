import { navigationGroups } from "./navigation-config";
import { isNavigationItemActive } from "./navigation-utils";
import { SidebarNavItem } from "./sidebar-nav-item";

type SidebarNavigationProps = {
  pathname: string;
  onNavigate?: () => void;
};

export function SidebarNavigation({ pathname, onNavigate }: SidebarNavigationProps) {
  const mainGroups = navigationGroups.slice(0, -1);
  const workspaceGroup = navigationGroups.at(-1)!;

  return (
    <nav aria-label="Dashboard navigation" className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-7">
          {mainGroups.map((group) => (
            <section key={group.label} aria-labelledby={`sidebar-${group.label.replace(" ", "-")}`}>
              <h2
                id={`sidebar-${group.label.replace(" ", "-")}`}
                className="mb-2.5 px-3 text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400"
              >
                {group.label}
              </h2>
              <ul className="space-y-0.5">
                {group.items.map((item) => (
                  <SidebarNavItem
                    key={item.href}
                    item={item}
                    isActive={isNavigationItemActive(pathname, item.href)}
                    onNavigate={onNavigate}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <div className="shrink-0 border-t border-zinc-100 px-6 py-6">
        <section
          key={workspaceGroup.label}
          aria-labelledby={`sidebar-${workspaceGroup.label.replace(" ", "-")}`}
        >
          <h2
            id={`sidebar-${workspaceGroup.label.replace(" ", "-")}`}
            className="mb-2.5 px-3 text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400"
          >
            {workspaceGroup.label}
          </h2>
          <ul className="space-y-0.5">
            {workspaceGroup.items.map((item) => (
              <SidebarNavItem
                key={item.href}
                item={item}
                isActive={isNavigationItemActive(pathname, item.href)}
                onNavigate={onNavigate}
              />
            ))}
          </ul>
        </section>
      </div>
    </nav>
  );
}
