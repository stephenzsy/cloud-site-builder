import { match } from "@formatjs/intl-localematcher";
import { NextRequest, NextResponse, type NextMiddleware } from "next/server";

export const supportedLocales = process.env.SITE_SUPPORTED_LOCALES
  ? process.env.SITE_SUPPORTED_LOCALES.split(",")
  : ["en"];

const defaultLocale = "en";

function getPreferredLanguages(request: NextRequest): string[] | undefined {
  try {
    const value = request.headers.get("Accept-Language");
    if (!value) {
      return;
    }
    const parts = value.split(",");
    const l = parts.map((p) => p.trim().split(";q="));
    return l
      .sort((a, b) => {
        return (
          (b.length > 1 ? parseFloat(b[1]) : 1) -
          (a.length > 1 ? parseFloat(a[1]) : 1)
        );
      })
      .map((p) => p[0]);
  } catch {
    // ignore any error
  }
  return;
}

function getLocale(request: NextRequest) {
  const userLangs = getPreferredLanguages(request);
  if (!userLangs) {
    return defaultLocale;
  }
  return match(userLangs, supportedLocales, defaultLocale);
}

export const middleware: NextMiddleware = (request) => {
  const { pathname } = request.nextUrl;
  if (
    supportedLocales.every(
      (l) => !pathname.startsWith(`/${l}/`) && pathname !== `/${l}`
    )
  ) {
    const userLocale = getLocale(request);
    console.log(pathname, userLocale, supportedLocales);
    return NextResponse.redirect(
      new URL(`/${userLocale}/${pathname}`, request.url)
    );
  }
};

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
