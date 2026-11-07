import assert from "node:assert/strict";
import { DEFAULT_CLIENTS } from "../src/components/dashboard/clients/clients-data";
import { deleteClientProject, formatProjectBudget, getClientProjects, projectStatistics, saveClientProject, validateProjectForm, type ClientProject } from "../src/components/dashboard/clients/client-projects-data";

function form(overrides: Record<string, string> = {}) {
  const data = new FormData();
  for (const [key, value] of Object.entries({ name: "Website rebuild", description: "New site", deliverables: "Design and development", budget: "12000.30", currency: "MAD", startDate: "2026-11-01", deadline: "2026-12-01", progress: "25", status: "ACTIVE", ...overrides })) data.set(key, value);
  return data;
}

const parsed = validateProjectForm(form());
assert.ok(parsed.value);
assert.equal(parsed.value.budget, "12000.30");
const project: ClientProject = { ...parsed.value, id: "test-project", clientId: "cl-1" };
const initial = DEFAULT_CLIENTS.map((client) => ({ ...client }));
const created = saveClientProject(initial, "cl-1", project);
assert.equal(getClientProjects(created[0]).length, 2);
assert.equal(getClientProjects(created[0])[0].name, "Website rebuild");
assert.equal(created[0].activeProjects, 1);
assert.equal(created[1], initial[1]);
assert.equal(getClientProjects(initial[0]).length, 1);
assert.equal(getClientProjects(initial[0])[0].budget, null);
assert.equal(getClientProjects(initial[0])[0].status, null);
assert.equal(getClientProjects(created[1]).some((item) => item.id === project.id), false);
assert.equal(saveClientProject(initial, "cl-2", project), initial);

const held = saveClientProject(created, "cl-1", { ...project, status: "ON_HOLD" });
assert.deepEqual(projectStatistics(getClientProjects(held[0])), { all: 2, active: 0, completed: 0, onHold: 1 });
const completed = saveClientProject(held, "cl-1", { ...project, progress: 100, status: "COMPLETED" });
assert.deepEqual(projectStatistics(getClientProjects(completed[0])), { all: 2, active: 0, completed: 1, onHold: 0 });
assert.equal(getClientProjects(completed[0]).length, 2, "Editing must not duplicate a project");
assert.equal(getClientProjects(deleteClientProject(completed, "cl-2", project.id)[0]).length, 2);
const deleted = deleteClientProject(completed, "cl-1", project.id);
assert.equal(getClientProjects(deleted[0]).length, 1);
const empty = deleteClientProject(deleted, "cl-1", getClientProjects(deleted[0])[0].id);
assert.deepEqual(getClientProjects(empty[0]), [], "Deleting the final project must not resurrect the legacy name");

const invalidForms: Record<string, string>[] = [
  { name: "   " }, { progress: "101" }, { progress: "-1" }, { progress: "20.5" },
  { budget: "-10" }, { budget: "1.001" }, { budget: "1e6" }, { currency: "XYZ" },
  { deadline: "2026-10-01" }, { startDate: "2026-02-30" }, { deadline: "invalid" },
  { status: "OTHER" }, { status: "COMPLETED", progress: "99" },
];
for (const overrides of invalidForms) assert.equal(validateProjectForm(form(overrides)).value, undefined, JSON.stringify(overrides));
assert.ok(validateProjectForm(form({ status: "COMPLETED", progress: "100" })).value);
assert.ok(validateProjectForm(form({ budget: "", startDate: "", deadline: "" })).value);
assert.match(formatProjectBudget("999999999999.99", "USD"), /999,999,999,999\.99/);
assert.match(formatProjectBudget("0.10", "MAD"), /0\.10/);
assert.equal(formatProjectBudget(null, "USD"), "Not recorded");
console.log("PASS: client-scoped project creation/edit/delete, statistics, legacy/empty records, form validation, and exact budget formatting.");
