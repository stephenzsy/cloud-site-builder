import { GraphQLClient, gql } from "graphql-request";
import { Entity, EntityResponse, ID } from "./models/common";
import { LocalizedEntity, Page, Section, Site } from "./models/entities";

export interface SiteLoader {
  getSiteAsync(id: ID, locale: string): Promise<Entity<Site> | undefined>;
  getPageAsync(id: ID, locale: string): Promise<Entity<Page> | undefined>;
  getSectionAsync(id: ID, locale: string): Promise<Entity<Section> | undefined>;
}

const contentFetch = gql`content(filters: { visible: { eq: true } }) {
  slotName
  textValue
  svgIcon {
    iconData
    schema
  }
  section {
    data {
      id
    }
  }
}`;

export class GraphqlLiveSiteLoader implements SiteLoader {
  private static readonly getSiteQuery = gql`
    query Site($id: ID) {
      site(id: $id) {
        data {
          id
          attributes {
            locale
            localizations {
              data {
                id
                attributes {
                  locale
                }
              }
            }
            ${contentFetch}
            cssVariables
            pages {
              data {
                id
                attributes {
                  slug
                }
              }
            }
          }
        }
      }
    }
  `;

  private static getPageQuery = gql`
    query Page($id: ID) {
      page(id: $id) {
        data {
          attributes {
            slug
            locale
            localizations {
              data {
                id
                attributes {
                  locale
                }
              }
            }
            ${contentFetch}
          }
        }
      }
    }
  `;

  private static getSectionQuery = gql`
    query Section($id: ID) {
      section(id: $id) {
        data {
          attributes {
            templateId
            locale
            localizations {
              data {
                id
                attributes {
                  locale
                }
              }
            }
            ${contentFetch}
          }
        }
      }
    }
  `;

  private readonly client: GraphQLClient;

  private readonly sitesStore: Record<ID, Entity<Site>> = {};
  private readonly pagesStore: Record<ID, Entity<Page>> = {};
  private readonly sectionsStore: Record<ID, Entity<Section>> = {};

  private readonly defaultLocale = "en";

  constructor(cmsUrl: string, token: string) {
    this.client = new GraphQLClient(cmsUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private async getEntity<
    T extends LocalizedEntity<T>,
    K extends "site" | "page" | "section"
  >(
    store: Record<ID, Entity<T>>,
    query: string,
    key: K,
    id: ID,
    locale?: string
  ): Promise<Entity<T> | undefined> {
    let stored = store[id];
    if (!stored) {
      const response = await this.client.request<
        { [key in K]?: EntityResponse<T> } | undefined
      >(query, { id });
      if (response?.[key]?.data) {
        stored = store[id] = response[key]!.data!;
      } else {
        return undefined;
      }
    }

    if (!locale) {
      return stored;
    }
    if (stored.attributes?.locale === locale) {
      return stored;
    } else {
      // fetch with id with correct localization
      const matched = stored.attributes?.localizations?.data?.find(
        (entity) => entity.attributes?.locale === locale
      );
      if (matched?.id) {
        return this.getEntity(store, query, key, matched.id, locale);
      }
      if (locale !== this.defaultLocale) {
        // no matched, try match default locale
        const matchedDefault = stored.attributes?.localizations?.data?.find(
          (entity) => entity.attributes?.locale === this.defaultLocale
        );
        if (matchedDefault?.id) {
          return this.getEntity(
            store,
            query,
            key,
            matchedDefault.id,
            this.defaultLocale
          );
        }
      }
    }
    return undefined;
  }

  public getSiteAsync(
    id: ID,
    locale: string
  ): Promise<Entity<Site> | undefined> {
    return this.getEntity<Site, "site">(
      this.sitesStore,
      GraphqlLiveSiteLoader.getSiteQuery,
      "site",
      id,
      locale
    );
  }

  public getPageAsync(
    id: ID,
    locale: string
  ): Promise<Entity<Page> | undefined> {
    return this.getEntity<Page, "page">(
      this.pagesStore,
      GraphqlLiveSiteLoader.getPageQuery,
      "page",
      id,
      locale
    );
  }

  public getSectionAsync(
    id: ID,
    locale: string
  ): Promise<Entity<Section> | undefined> {
    return this.getEntity<Section, "section">(
      this.sectionsStore,
      GraphqlLiveSiteLoader.getSectionQuery,
      "section",
      id,
      locale
    );
  }
}
