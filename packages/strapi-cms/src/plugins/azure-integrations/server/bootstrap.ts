import type { Strapi } from "@strapi/strapi";

export default async ({ strapi }: { strapi: Strapi }) => {
  // bootstrap phase
  await (strapi as any).admin.services.permission.actionProvider.register({
    section: "plugins",
    displayName: "Read azure integration configuration",
    uid: "read",
    pluginName: "azure-integrations",
  });
};
