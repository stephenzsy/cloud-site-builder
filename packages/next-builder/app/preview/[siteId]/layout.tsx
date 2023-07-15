import Block from "@/components/Block";
import { ComponentContentType } from "@/components/types";
import { gql } from "@/lib/generated/gql";
import { getGraphqlClient } from "@/lib/graphql-client";
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
  const siteAttributes = (
    await client.query({
      query: QUERY_GET_SITE,
      variables: {
        id: siteId,
      },
    })
  ).data.site?.data?.attributes;
  const blockId =
    siteAttributes?.template?.data?.attributes?.siteLayout?.data?.id;
  if (!blockId) {
    return <div>No site layout specified</div>;
  }
  return (
    <>
      <Block
        id={blockId}
        client={client}
        content={siteAttributes?.content as unknown as ComponentContentType[]}
      >
        {children}
      </Block>
      {process.env.NODE_ENV === "production" && (
        <>
          <Script
            src="https://cdn.tailwindcss.com"
            strategy="beforeInteractive"
          />
          <Script id="tw-config">
            {`
      tailwind.config = { 
        theme: {
          colors: {
            brand: {
              50: "rgb(var(--color-brand-50) / <alpha-value>)",
              100: "rgb(var(--color-brand-100) / <alpha-value>)",
              200: "rgb(var(--color-brand-200) / <alpha-value>)",
              300: "rgb(var(--color-brand-300) / <alpha-value>)",
              400: "rgb(var(--color-brand-400) / <alpha-value>)",
              500: "rgb(var(--color-brand-500) / <alpha-value>)",
              600: "rgb(var(--color-brand-600) / <alpha-value>)",
              700: "rgb(var(--color-brand-700) / <alpha-value>)",
              800: "rgb(var(--color-brand-800) / <alpha-value>)",
              900: "rgb(var(--color-brand-900) / <alpha-value>)",
              950: "rgb(var(--color-brand-950) / <alpha-value>)",
              DEFAULT: "rgb(var(--color-brand) / <alpha-value>)",
            }
          }
        }
      }`}
          </Script>
        </>
      )}
      <style>{`:root{}`}</style>
    </>
  );
}
