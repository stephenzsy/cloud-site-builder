/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React, { useEffect, useState } from "react";
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
  } = useQuery<QueryResult[]>(
    "get-token",
    async () => {
      const resp = await get("next-builder-connector/token");
      console.log(resp);
      return resp.data;
    },
    { enabled: false }
  );

  const [siteId, setSiteId] = useState<string>();

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
            <div>
              <Button disabled={!siteId} onClick={() => {
                refetchToken()
              }}>
                Preview
              </Button>
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
