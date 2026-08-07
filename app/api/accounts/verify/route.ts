import { neon } from "@neondatabase/serverless";
import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

function hashSyncCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

export async function POST(req: NextRequest) {
  const { syncCode } = await req.json();

  if (!syncCode || typeof syncCode !== "string") {
    return NextResponse.json({ error: "Sync code required" }, { status: 400 });
  }

  const hash = hashSyncCode(syncCode.trim().toUpperCase());

  const rows = await sql`
    SELECT id FROM accounts WHERE sync_code_hash = ${hash}
  `;

  if (rows.length === 0) {
    return NextResponse.json({ error: "Invalid sync code" }, { status: 404 });
  }

  // await sql`
  //   UPDATE accounts SET last_seen_at = now() WHERE id = ${rows[0].id}
  // `;

  return NextResponse.json({ accountId: rows[0].id });
}
