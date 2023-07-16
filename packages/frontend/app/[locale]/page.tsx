import { Entity } from "@/lib/models/common";
import { ComponentSlotContent, Section } from "@/lib/models/entities";
import React from "react"
import type { SiteLoader } from "@/lib/site-loader";
import { getLoaderConfig, mapSlots } from "./_utils";

export { generateStaticParams } from "./layout";

function PageSectionSlot({
  section,
  siteLoader,
}: {
  section: Entity<Section>;
  siteLoader: SiteLoader;
}) {
  if (section.attributes?.templateId === "hero-section") {
    const [, namedSlots] = mapSlots(section.attributes.content);
    return (
      <section className="w-full h-[400px] border rounded-xl p-10 grid items-center justify-center bg-gradient-to-tr from-brand_analogous_ccw_1-200 from-10% via-brand-300 via-30% to-brand_analogous_cw_1-100 to-90%">
        {namedSlots["hero-text"]?.map((c, index) => (
          <div className="text-3xl text-center text-semibold" key={index}>
            {c.textValue}
          </div>
        ))}
      </section>
    );
  }
  return null;
}

function PageSlot({
  content,
  siteLoader,
  locale,
}: {
  content: ComponentSlotContent;
  siteLoader: SiteLoader;
  locale: string;
}) {
  if (content.section) {
    const id = content.section.data?.id;
    if (id) {
      const section = siteLoader.getStoredSection(id, locale);
      if (section) {
        return <PageSectionSlot section={section} siteLoader={siteLoader} />;
      }
    }
  }
  return null;
}

export default async function Home({ params }: { params: { locale: string } }) {
  const loaderConfig = getLoaderConfig();
  if (!loaderConfig) {
    return <main className="flex-grow">No site available</main>;
  }
  const [loader, siteId] = loaderConfig;
  const site = await loader.getSiteAsync(siteId, params.locale);
  // find home page
  const pageRef = site?.attributes?.pages?.data?.find(
    (p) => p.attributes?.slug === "home"
  );
  if (!pageRef?.id) {
    return <main className="flex-grow">No home page configured</main>;
  }
  const page = await loader.getPageAsync(pageRef.id!, params.locale);
  const [defaultSlot, namedSlots] = mapSlots(page?.attributes?.content);
  return (
    <div className="pl-safe pr-safe">
      <main className="flex flex-col flex-grow p-6 mx-auto max-w-screen-lg">
        {defaultSlot.map((entry, index) => (
          <PageSlot
            key={index}
            content={entry}
            siteLoader={loader}
            locale={params.locale}
          />
        ))}
      </main>
    </div>
  );
}
