/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query SiteInfo($id: ID) {\n    site(id: $id) {\n      data {\n        attributes {\n          template {\n            data {\n              id\n              attributes {\n                siteLayout {\n                  data {\n                    id\n                  }\n                }\n                cssVariables {\n                  entry\n                }\n              }\n            }\n          }\n          content {\n            ... on ComponentContentShortText {\n              description\n              id\n              value\n              targets {\n                data {\n                    id\n                }\n              }\n            }\n            ... on ComponentContentSvgIcon {\n              description\n              height\n              iconPathData\n              id\n              width\n              targets {\n                data {\n                    id\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": types.SiteInfoDocument,
    "\nquery Block($id: ID) {\n  block(id: $id) {\n    data {\n      attributes {\n        htmlTag\n        twClass\n        children {\n          twClass\n          block {\n            data {\n              id\n            }\n          }\n        }\n        slot {\n          data {\n            id\n          }\n        }\n        slotFlag\n      }\n    }\n  }\n}": types.BlockDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query SiteInfo($id: ID) {\n    site(id: $id) {\n      data {\n        attributes {\n          template {\n            data {\n              id\n              attributes {\n                siteLayout {\n                  data {\n                    id\n                  }\n                }\n                cssVariables {\n                  entry\n                }\n              }\n            }\n          }\n          content {\n            ... on ComponentContentShortText {\n              description\n              id\n              value\n              targets {\n                data {\n                    id\n                }\n              }\n            }\n            ... on ComponentContentSvgIcon {\n              description\n              height\n              iconPathData\n              id\n              width\n              targets {\n                data {\n                    id\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query SiteInfo($id: ID) {\n    site(id: $id) {\n      data {\n        attributes {\n          template {\n            data {\n              id\n              attributes {\n                siteLayout {\n                  data {\n                    id\n                  }\n                }\n                cssVariables {\n                  entry\n                }\n              }\n            }\n          }\n          content {\n            ... on ComponentContentShortText {\n              description\n              id\n              value\n              targets {\n                data {\n                    id\n                }\n              }\n            }\n            ... on ComponentContentSvgIcon {\n              description\n              height\n              iconPathData\n              id\n              width\n              targets {\n                data {\n                    id\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery Block($id: ID) {\n  block(id: $id) {\n    data {\n      attributes {\n        htmlTag\n        twClass\n        children {\n          twClass\n          block {\n            data {\n              id\n            }\n          }\n        }\n        slot {\n          data {\n            id\n          }\n        }\n        slotFlag\n      }\n    }\n  }\n}"): (typeof documents)["\nquery Block($id: ID) {\n  block(id: $id) {\n    data {\n      attributes {\n        htmlTag\n        twClass\n        children {\n          twClass\n          block {\n            data {\n              id\n            }\n          }\n        }\n        slot {\n          data {\n            id\n          }\n        }\n        slotFlag\n      }\n    }\n  }\n}"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;