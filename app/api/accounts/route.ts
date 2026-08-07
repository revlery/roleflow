import { neon } from "@neondatabase/serverless";
import { randomBytes, createHash } from "crypto";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

function generateSyncCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(8);
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return code;
}

function hashSyncCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

export async function POST() {
  for (let attempt = 0; attempt < 5; attempt++) {
    const syncCode = generateSyncCode();
    const hash = hashSyncCode(syncCode);

    try {
      const rows = await sql`
        INSERT INTO accounts (sync_code_hash)
        VALUES (${hash})
        RETURNING id
      `;
      const accountId = rows[0].id;

      return NextResponse.json({ accountId, syncCode });
    } catch (err: any) {
      if (err.code === "23505") continue;
      console.error("Failed to create account:", err);
      return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Failed to generate unique sync code" }, { status: 500 });
}
