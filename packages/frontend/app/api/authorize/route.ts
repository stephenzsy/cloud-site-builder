import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { NextRequest, NextResponse } from "next/server";
import process from "process";

export function GET(request: NextRequest) {
  if (process.env.CSB_FE_ROLE === "preview") {
    const token = request.nextUrl.searchParams.get("token")?.trim();
    const siteId = request.nextUrl.searchParams.get("siteId")?.trim();
    if (!token || !siteId) {
      return NextResponse.json(
        { error: "No token or siteId in URL" },
        { status: 400 }
      );
    }
    cookies().set({
      name: "StrapiToken",
      value: token,
      httpOnly: true,
      path: "/",
    });
    cookies().set({
      name: "StrapiSiteId",
      value: siteId,
      path: "/",
    });
    return NextResponse.redirect(new URL("/", request.url));
  }
  return new NextResponse(undefined, { status: 404 });
}
