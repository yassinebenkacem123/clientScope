import assert from "node:assert/strict";
import { navigationGroups } from "../src/components/dashboard/sidebar/navigation-config";
import { isNavigationItemActive } from "../src/components/dashboard/sidebar/navigation-utils";

const itemCount = navigationGroups.reduce((count, group) => count + group.items.length, 0);

assert.equal(itemCount, 11, "The sidebar must expose exactly 11 navigation items");
assert.equal(isNavigationItemActive("/dashboard", "/dashboard"), true);
assert.equal(isNavigationItemActive("/dashboard/projects", "/dashboard"), false);
assert.equal(isNavigationItemActive("/dashboard/projects", "/dashboard/projects"), true);
assert.equal(isNavigationItemActive("/dashboard/projects/project-1", "/dashboard/projects"), true);
assert.equal(isNavigationItemActive("/dashboard/project", "/dashboard/projects"), false);

console.log("Sidebar active-state checks: PASS");
