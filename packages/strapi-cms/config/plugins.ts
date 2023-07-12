export default function pluginsConfig({ env }) {
  return {
    "azure-integrations": {
      enabled: true,
      resolve: "./src/plugins/azure-integrations",
    },
    /*
    'next-builder-connector': {
      enabled: true,
      resolve: './src/plugins/next-builder-connector'
    },*/
  };
}
