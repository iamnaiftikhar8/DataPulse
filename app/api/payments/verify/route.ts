//app/api/payments/verify/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL!;
  const session_id = req.nextUrl.searchParams.get("session_id");
  if (!session_id) return NextResponse.json({ message: "Missing session_id" }, { status: 400 });

  const r = await fetch(`${backend}/api/v1/payments/verify?session_id=${encodeURIComponent(session_id)}`);
  const data = await r.json().catch(() => ({}));
  return NextResponse.json(data, { status: r.status });
}
