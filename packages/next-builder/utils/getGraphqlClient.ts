import { ApolloClient, InMemoryCache } from "@apollo/client";

export function getGraphqlClient() {
  const client = new ApolloClient({
    uri: process.env.STRAPI_CMS_GRAPHQL_URI as string,
    cache: new InMemoryCache({}),
  });
}
