// lib/client.js
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

export function getGraphqlClient(token: string) {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: process.env.STRAPI_GRAPHQL_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    ssrMode: true,
  });
}
