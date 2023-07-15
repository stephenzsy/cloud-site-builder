import { gql } from "@/lib/generated";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import classNames from "classnames";
import { Fragment, PropsWithChildren } from "react";
import { ComponentContentType } from "./types";
import { SelectSlotWithContent } from "./Slot";

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
        }
        slot {
          data {
            id
          }
        }
        slotFlag
      }
    }
  }
}`);

export default async function Block({
  id,
  client,
  className,
  children,
  content,
}: PropsWithChildren<{
  id: string;
  client: ApolloClient<NormalizedCacheObject>;
  className?: string;
  content?: ComponentContentType[] | null;
}>) {
  const blockAttributes = (
    await client.query({
      query: getBlockQuery,
      variables: { id },
    })
  ).data.block?.data?.attributes;
  const {
    htmlTag,
    twClass,
    children: blockChildren,
    slotFlag,
    slot,
  } = blockAttributes ?? {};
  const Tag = htmlTag || "div";
  return (
    <Tag className={classNames(className, twClass) || undefined}>
      {slotFlag === "page" ? (
        children
      ) : slot?.data?.id ? (
        <SelectSlotWithContent slotId={slot.data.id} content={content} />
      ) : (
        blockChildren?.map((blockCompose, index) => {
          const childBlockId = blockCompose?.block?.data?.id;
          if (!childBlockId) {
            return null;
          }
          return (
            <Block
              key={index}
              id={childBlockId}
              client={client}
              className={blockCompose.twClass || undefined}
              content={content}
            />
          );
        })
      )}
    </Tag>
  );
}
