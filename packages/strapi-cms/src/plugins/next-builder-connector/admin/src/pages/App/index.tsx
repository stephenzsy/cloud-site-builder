/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React, { useEffect, useMemo, useState } from "react";
import {
  SingleSelect,
  SingleSelectOption,
  Layout,
  ContentLayout,
  HeaderLayout,
  Main,
  Button,
} from "@strapi/design-system";
import { useFetchClient } from "@strapi/helper-plugin";
import { useQuery } from "react-query";

type QueryResult = {
  id: number;
  name: string;
};

type TokenResult = {
  baseUrl: string;
  token: string;
};

const App = () => {
  const { get } = useFetchClient();
  const { data, refetch } = useQuery<QueryResult[]>("get-sites", async () => {
    const { data } = await get(
      "content-manager/collection-types/api::site.site"
    );
    console.log("fetched");
    return data.results;
  });
  const {
    data: tokenData,
    refetch: refetchToken,
    remove,
  } = useQuery<TokenResult>(
    "get-token",
    async () => {
      const { data } = await get("next-builder-connector/token");
      return data;
    },
    { enabled: false }
  );

  const [siteId, setSiteId] = useState<string>();

  const previewUrl = useMemo(() => {
    if (!tokenData || !siteId) {
      return undefined;
    }
    const url = new URL("authorize", tokenData.baseUrl);
    url.searchParams.set("token", tokenData.token);
    url.searchParams.set("siteId", siteId);
    return url.toString();
  }, [tokenData, siteId]);

  return (
    <Layout>
      <Main>
        <HeaderLayout title="Preview and Deploy" />
        <ContentLayout>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div>
              <Button
                variant="secondary"
                onClick={() => {
                  refetch();
                  remove();
                }}
              >
                Refresh List
              </Button>
            </div>
            <SingleSelect label="Site" value={siteId} onChange={setSiteId}>
              {data?.map((entry) => (
                <SingleSelectOption value={entry.id.toString()} key={entry.id}>
                  {entry.id} - {entry.name}
                </SingleSelectOption>
              ))}
            </SingleSelect>
            <div
              style={{
                display: "flex",
                gap: 8,
              }}
            >
              <Button
                disabled={!siteId}
                onClick={() => {
                  refetchToken();
                }}
              >
                Generate Preview Link
              </Button>
              {previewUrl && (
                <a href={previewUrl} target="_blank">
                  Preview Link
                </a>
              )}
            </div>
            <div>
              <Button variant="danger" disabled={true}>
                Deploy
              </Button>
            </div>
          </div>
        </ContentLayout>
      </Main>
    </Layout>
  );
};

export default App;
