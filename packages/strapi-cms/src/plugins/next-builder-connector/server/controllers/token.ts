import { Strapi } from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({
  getToken(ctx) {
    ctx.body = strapi
      .plugin("next-builder-connector")
      .service("jwt")
      .issueContentReadToken();
  },
});
