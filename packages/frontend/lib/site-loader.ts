import { GraphQLClient, gql } from "graphql-request";
import { use } from "react";
import { Entity, EntityResponse, ID } from "./models/common";
import { Site } from "./models/site";
import { cookies } from "next/dist/client/components/headers";

export interface SiteLoader {
  getSiteAsync(id: string, locale: string): Promise<Entity<Site> | undefined>;
  getPage(id: string): {};
}

export class GraphqlLiveSiteLoader implements SiteLoader {
  private static readonly GET_SITE_REQUEST = gql`
    query Site($id: ID) {
      site(id: $id) {
        data {
          id
          attributes {
            locale
            content {
              slotName
              textValue
              visible
              svgIcon {
                description
                iconData
                id
                schema
              }
              section {
                data {
                  id
                }
              }
            }
            localizations {
              data {
                id
                attributes {
                  locale
                }
              }
            }
          }
        }
      }
    }
  `;

  private readonly client: GraphQLClient;

  private readonly cachedSites: Record<ID, Entity<Site>> = {};

  constructor(cmsUrl: string, token: string) {
    this.client = new GraphQLClient(cmsUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  public async getSiteAsync(
    id: string,
    locale: string
  ): Promise<Entity<Site> | undefined> {
    let cachedSite = this.cachedSites[id];
    if (cachedSite) {
      if (cachedSite.attributes?.locale === locale) {
        return cachedSite;
      }
    } else {
      const response = await this.client.request<
        { site?: EntityResponse<Site> } | undefined
      >(GraphqlLiveSiteLoader.GET_SITE_REQUEST, { id });
      if (response?.site?.data) {
        cachedSite = this.cachedSites[id] = response.site.data;
      } else {
        return;
      }
    }
    if (cachedSite.attributes?.locale === locale) {
      return cachedSite;
    } else {
      // fetch with id with correct localization
      const matched = cachedSite.attributes?.localizations?.data?.find(
        (entity) => entity.attributes?.locale === locale
      );
      if (matched?.id) {
        return this.getSiteAsync(matched.id, locale);
      }
    }
    return undefined;
  }

  public getPage(id: string): {} {
    return {};
  }
}
