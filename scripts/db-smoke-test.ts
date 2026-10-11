import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("Missing DATABASE_URL");
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  try {
    const rows = await prisma.$queryRaw<Array<{ ok: number }>>`SELECT 1::int AS ok`;
    if (rows[0]?.ok !== 1) throw new Error("SELECT 1 returned unexpected result");
    const workspaces = await prisma.workspace.count();
    const projects = await prisma.project.count();
    console.log(JSON.stringify({ connection: "PASS", select1: "PASS", workspaces, projects }, null, 2));
  } finally { await prisma.$disconnect(); }
}
main().catch(error => { console.error("Database smoke test FAILED:", error.message); process.exitCode = 1; });
