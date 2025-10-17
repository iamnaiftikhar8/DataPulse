// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://data-pulse-api.vercel.app";
export const runtime = "nodejs"; export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.text();
  const upstream = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    body,
    headers: { "content-type": "application/json" },
  });

  const res = new NextResponse(upstream.body, { status: upstream.status });
  const setCookie = upstream.headers.get("set-cookie");
  if (setCookie) res.headers.set("set-cookie", setCookie);
  const ct = upstream.headers.get("content-type");
  if (ct) res.headers.set("content-type", ct);
  return res;
}
