import { Strapi } from "@strapi/strapi";

export default async ({ strapi }: { strapi: Strapi }) => {
  // bootstrap phase
  await strapi.admin.services.permission.actionProvider.registerMany([
    {
      section: "plugins",
      displayName: "Preview site",
      uid: "preview",
      pluginName: "next-builder-connector",
    },
    {
      section: "plugins",
      displayName: "Generate site",
      uid: "generate",
      pluginName: "next-builder-connector",
    },
  ]);
};
