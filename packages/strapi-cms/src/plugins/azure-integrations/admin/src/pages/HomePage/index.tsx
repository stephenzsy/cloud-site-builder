import React from "react";
import pluginId from "../../pluginId";
import { Main, HeaderLayout, ContentLayout, Box } from "@strapi/design-system";

export default function HomePage() {
  return (
    <Main>
      <HeaderLayout title="Azure integration settings" />
      <ContentLayout>
        <Box>
          <pre>AZURE_KEY_VAULT_URL</pre>
        </Box>
      </ContentLayout>
    </Main>
  );
}
