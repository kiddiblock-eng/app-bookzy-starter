export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

// Health check pour Render — répond 200 sans auth ni accès DB.
// Ne PAS utiliser "/" comme healthCheckPath (redirigé en 307 par le middleware).
export async function GET() {
  return NextResponse.json({ status: "ok" }, { status: 200 });
}
