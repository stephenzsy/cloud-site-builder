import path from "path";

export default function pluginsConfig({ env }) {
  return {
    "azure-integrations": {
      enabled: true,
      resolve: "./src/plugins/azure-integrations",
      config: {
        blobUploadContainerUrl: env("UPLOAD_AZURE_STORAGE_BLOB_CONTAINER_URL"),
        blobUploadPrefix: env("UPLOAD_AZURE_STORAGE_BLOB_PREFIX", ""),
      },
    },
    "next-builder-connector": {
      enabled: true,
      resolve: "./src/plugins/next-builder-connector",
    },
    graphql: {
      config: {
        artifacts: {
          schema: true,
        },
        generateArtifacts: true,
      },
    },
    email: {
      config: {
        settings: {
          defaultFrom: env("AZURE_COMMUNICATION_EMAIL_DEFAULT_MAILFROM"),
        },
      },
    },
  };
}
