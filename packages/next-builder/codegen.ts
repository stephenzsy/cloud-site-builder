import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "../strapi-cms/schema.graphql",
  documents: [
    "app/**/*.tsx",
    "app/**/*.ts",
    "components/**/*.ts",
    "components/**/*.tsx",
  ],
  generates: {
    "./lib/generated/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: "gql",
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
