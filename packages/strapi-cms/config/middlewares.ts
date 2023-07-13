export default function ({ env }) {
  const envAzureBlob = env("UPLOAD_AZURE_STORAGE_BLOB_CONTAINER_URL", "");
  let cspDirective: string | undefined;
  if (envAzureBlob) {
    const url = new URL(envAzureBlob);
    cspDirective = `${url.protocol}//${url.host}`;
  }
  return [
    "strapi::errors",
    {
      name: "strapi::security",
      config: cspDirective
        ? {
            contentSecurityPolicy: {
              directives: {
                "img-src": [
                  "'self'",
                  "data:",
                  "blob:",
                  "https://market-assets.strapi.io",
                  cspDirective,
                ],
                "media-src": ["'self'", "data:", "blob:", cspDirective],
              },
            },
          }
        : undefined,
    },
    "strapi::cors",
    "strapi::poweredBy",
    "strapi::logger",
    "strapi::query",
    "strapi::body",
    "strapi::session",
    "strapi::favicon",
    "strapi::public",
  ];
}
