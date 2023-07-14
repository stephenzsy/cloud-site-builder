import { NextResponse, type NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { RedirectType } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";

export function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const siteId = request.nextUrl.searchParams.get("siteId");

  if (!token || !siteId) {
    return new NextResponse("Please have token parameters of: token, siteId.", {
      status: 400,
    });
  }

  cookies().set({
    name: "StrapiToken",
    value: token.trim(),
    httpOnly: true,
    path: "/",
  });

  redirect(`/preview/${siteId}/draft`, RedirectType.replace);
}
