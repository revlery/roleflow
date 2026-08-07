import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(req: Request) {
  const accountId = new URL(req.url).searchParams.get("accountId");
  if (!accountId) return NextResponse.json({ error: "accountId required" }, { status: 400 });

  const rows = await sql`
    SELECT ciphertext, updated_at FROM boards WHERE account_id = ${accountId}
  `;
  if (rows.length === 0) return NextResponse.json({ ciphertext: null });
  return NextResponse.json({ ciphertext: rows[0].ciphertext, updatedAt: rows[0].updated_at });
}

export async function PUT(req: Request) {
  const { accountId, ciphertext } = await req.json();
  if (!accountId || typeof ciphertext !== "string") {
    return NextResponse.json({ error: "accountId and ciphertext required" }, { status: 400 });
  }
  await sql`
    INSERT INTO boards (account_id, ciphertext, updated_at)
    VALUES (${accountId}, ${ciphertext}, now())
    ON CONFLICT (account_id) DO UPDATE SET ciphertext = ${ciphertext}, updated_at = now()
  `;
  return NextResponse.json({ ok: true });
}
