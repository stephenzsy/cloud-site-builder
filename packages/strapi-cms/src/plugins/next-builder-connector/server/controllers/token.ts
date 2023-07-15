import { Strapi } from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({
  getToken(ctx) {
    ctx.body = {
      baseUrl: strapi.config.get(
        "plugin.next-builder-connector.previewSiteUrl"
      ),
      token: strapi
        .plugin("next-builder-connector")
        .service("jwt")
        .issueContentReadToken(),
    };
  },
});
