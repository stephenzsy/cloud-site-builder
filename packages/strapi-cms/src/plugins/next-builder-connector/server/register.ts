import { Strapi, CustomFieldServerOptions } from "@strapi/strapi";
import pluginId from "./pluginId";

export default ({ strapi }: { strapi: Strapi }) => {
  strapi.customFields.register([
    {
      name: "test",
      plugin: pluginId,
      type: "string",
      //enum: ["site-layout"],
    } as CustomFieldServerOptions,
  ]);
  // registeration phase
};
