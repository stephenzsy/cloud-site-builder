import Block from "@/components/Block";
import { ComponentContentType } from "@/components/types";
import { gql } from "@/lib/generated/gql";
import { getGraphqlClient } from "@/lib/graphql-client";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { cookies } from "next/headers";
import Script from "next/script";
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
                cssVariables {
                  entry
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
  siteId,
  client,
}: PropsWithChildren<{
  siteId: string;
  client: ApolloClient<NormalizedCacheObject>;
}>) {
  const siteAttributes = (
    await client.query({
      query: QUERY_GET_SITE,
      variables: {
        id: siteId,
      },
    })
  ).data.site?.data?.attributes;
  const templateAttributes = siteAttributes?.template?.data?.attributes;
  const blockId = templateAttributes?.siteLayout?.data?.id;
  if (!blockId) {
    return <div>No site layout specified</div>;
  }
  const cssVariablesStyle = templateAttributes.cssVariables
    ?.map((c) => c?.entry)
    .join(";");
  return (
    <>
      <style>{`:root{${cssVariablesStyle}}`}</style>
      <Block
        id={blockId}
        client={client}
        content={siteAttributes?.content as unknown as ComponentContentType[]}
      >
        {children}
      </Block>
    </>
  );
}
