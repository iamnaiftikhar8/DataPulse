// app/api/analyze/route.ts
import { NextResponse } from "next/server";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://test-six-fawn-47.vercel.app";
export const runtime = "nodejs"; export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const cookie = req.headers.get("cookie") ?? "";
  const formData = await req.formData();

  const upstream = await fetch(`${API_BASE}/api/analyze`, {
    method: "POST",
    body: formData,
    headers: { cookie },
  });

  const res = new NextResponse(upstream.body, { status: upstream.status });
  const setCookie = upstream.headers.get("set-cookie");
  if (setCookie) res.headers.set("set-cookie", setCookie);
  const ct = upstream.headers.get("content-type");
  if (ct) res.headers.set("content-type", ct);
  return res;
}
