import Block from "@/components/Block";
import { ComponentContentType } from "@/components/types";
import { gql } from "@/lib/generated/gql";
import { getGraphqlClient } from "@/lib/graphql-client";
import { cookies } from "next/headers";
import { PropsWithChildren } from "react";

const QUERY_GET_SITE = gql(`
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
          content {
            ... on ComponentContentShortText {
              description
              id
              value
              targets {
                data {
                    id
                }
              }
            }
            ... on ComponentContentSvgIcon {
              description
              height
              iconPathData
              id
              width
              targets {
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
`);

export default async function SiteLayout({
  children,
  params,
}: PropsWithChildren<{ params: { siteId?: string } }>) {
  const token = cookies().get("StrapiToken")?.value;
  const { siteId } = params;
  if (!token || !siteId) {
    return <div>No token or siteId to fetch data</div>;
  }
  const client = getGraphqlClient(token);
  const siteAttributes = (await client.query({
    query: QUERY_GET_SITE,
    variables: {
      id: siteId,
    },
  })).data.site?.data?.attributes;
  const blockId = siteAttributes?.template?.data?.attributes?.siteLayout
      ?.data?.id;
  if (!blockId) {
    return <div>No site layout specified</div>;
  }
  return (
    <Block id={blockId} client={client} content={siteAttributes?.content as unknown as ComponentContentType[]}>
      {children}
      <style>{`:root{}`}</style>
    </Block>
  );
}
