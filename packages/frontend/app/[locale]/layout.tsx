import { SlotContentSvgIcon } from "@/components/slot-content/svg-icon";
import { supportedLocales } from "@/middleware";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getLoaderConfig, mapSlots } from "../_utils";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export async function generateStaticParams() {
  return supportedLocales.map((l) => ({
    locale: l,
  }));
}

export default async function RootLayout({
  params,
  children,
}: {
  params: { locale: string };
  children: React.ReactNode;
}) {
  const loaderConfig = getLoaderConfig();
  if (!loaderConfig) {
    return (
      <html lang={params.locale}>
        <body>No site available</body>
      </html>
    );
  }
  const [siteLoader, siteId] = loaderConfig;
  const siteEntity = await siteLoader.getSiteAsync(siteId, params.locale);
  // map slot
  const { cssVariables, content } = siteEntity?.attributes ?? {};
  const cssLine = cssVariables && `:root{${cssVariables.join(";")}`;
  const [defaultSlot, namedSlots] = mapSlots(content);
  return (
    <html lang={params.locale}>
      <body className={`${inter.className} text-neutral-950`}>
        {cssLine && <style>{cssLine}</style>}
        <header className="pt-safe pl-safe pr-safe">
          <div className="flex flex-row p-6 items-center gap-2 mx-auto max-w-screen-lg">
            <span className="text-6xl text-brand">
              <SlotContentSvgIcon content={namedSlots["site-logo"]} />
            </span>
            {namedSlots["site-title"]?.map((slot, index) => {
              return (
                <h1 key={index} className="font-bold text-5xl text-brand">
                  {slot.textValue}
                </h1>
              );
            })}
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
