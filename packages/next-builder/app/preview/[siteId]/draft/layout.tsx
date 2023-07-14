import Block from "@/components/Block";
import { gql } from "@/lib/generated/gql";
import { getGraphqlClient } from "@/lib/graphql-client";
import { cookies } from "next/headers";
import { PropsWithChildren } from "react";

const queryGetSite = gql(`
  query SiteInfo($id: ID) {
    site(id: $id) {
      data {
        attributes {
          template {
            data {
              id
              attributes {
                siteLayout {
                  data {
                    id
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`);

export default async function DraftLayout({
  children,
  params,
}: PropsWithChildren<{ params: { siteId?: string } }>) {
  const token = cookies().get("StrapiToken")?.value;
  const { siteId } = params;
  if (!token || !siteId) {
    return <div>No token or siteId to fetch data</div>;
  }
  const client = getGraphqlClient(token);
  const erSite = await client.query({
    query: queryGetSite,
    variables: {
      id: siteId,
    },
  });
  const blockId =
    erSite.data.site?.data?.attributes?.template?.data?.attributes?.siteLayout
      ?.data?.id;
  if (!blockId) {
    return <div>No site layout specified</div>;
  }
  return <Block id={blockId} client={client} isSiteLayout />;
}
