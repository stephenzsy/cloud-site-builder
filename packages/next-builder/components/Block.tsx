import { gql } from "@/lib/generated";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import classNames from "classnames";
import { Fragment, PropsWithChildren } from "react";

const getBlockQuery = gql(`
query Block($id: ID) {
  block(id: $id) {
    data {
      attributes {
        htmlTag
        twClass
        children {
          twClass
          block {
            data {
              id
            }
          }
          specialSlot
        }
        slot {
          data {
            id
          }
        }
      }
    }
  }
}`);

export default async function Block({
  id,
  client,
  className,
  isSiteLayout,
  children,
}: PropsWithChildren<{
  id: string;
  client: ApolloClient<NormalizedCacheObject>;
  className?: string;
  isSiteLayout?: boolean;
}>) {
  const blockAttributes = (
    await client.query({
      query: getBlockQuery,
      variables: { id },
    })
  ).data.block?.data?.attributes;
  const { htmlTag, twClass, children: blockChildren } = blockAttributes ?? {};
  const Tag = htmlTag || "div";
  return (
    <Tag className={classNames(className, twClass) || undefined}>
      {blockChildren?.map((blockCompose, index) => {
        if (blockCompose?.specialSlot) {
          if (isSiteLayout) {
            return <Fragment key={index}>{children}</Fragment>;
          }
          return null;
        }
        const childBlockId = blockCompose?.block?.data?.id;
        if (!childBlockId) {
          return null;
        }
        return (
          <Block
            key={index}
            id={childBlockId}
            client={client}
            className={blockCompose.twClass ?? undefined}
          />
        );
      })}
    </Tag>
  );
}
