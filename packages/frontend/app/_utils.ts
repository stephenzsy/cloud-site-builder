import { ComponentSlotContent } from "@/lib/models/entities";
import { GraphqlLiveSiteLoader, SiteLoader } from "@/lib/site-loader";
import { cookies } from "next/headers";

function getLiveSiteLoader(): [SiteLoader, string] | undefined {
  const token = cookies().get("StrapiToken")?.value.trim();
  const siteId = cookies().get("StrapiSiteId")?.value.trim();
  if (token && siteId) {
    return [
      new GraphqlLiveSiteLoader(process.env.STRAPI_CMS_GRAPHQL_URL!, token),
      siteId,
    ];
  }
}

let staticLoaderConfig: [SiteLoader, string] | undefined | false;

function getEnvSiteLoader(): [SiteLoader, string] | undefined {
  if (staticLoaderConfig === false) {
    return undefined;
  }
  if (staticLoaderConfig) {
    return staticLoaderConfig;
  }
  const token = process.env.STRAPI_TOKEN?.trim();
  const siteId = process.env.SITE_ID?.trim();
  if (token && siteId) {
    staticLoaderConfig = [
      new GraphqlLiveSiteLoader(process.env.STRAPI_CMS_GRAPHQL_URL!, token),
      siteId,
    ];
    return staticLoaderConfig;
  } else {
    staticLoaderConfig = false;
  }
  return undefined;
}

export const getLoaderConfig =
  process.env.CSB_FE_ROLE === "preview" ? getLiveSiteLoader : getEnvSiteLoader;

export function mapSlots(
  content: ComponentSlotContent[] | undefined
): [ComponentSlotContent[], Record<string, ComponentSlotContent[]>] {
  const namedSlots: Record<string, ComponentSlotContent[]> = {};
  const defaultSlot: ComponentSlotContent[] = [];

  if (content) {
    for (const entry of content) {
      if (entry.slotName) {
        let namedSlot = namedSlots[entry.slotName];
        if (!namedSlot) {
          namedSlot = namedSlots[entry.slotName] = [];
        }
        namedSlot.push(entry);
      } else {
        defaultSlot.push(entry);
      }
    }
  }
  return [defaultSlot, namedSlots];
}
