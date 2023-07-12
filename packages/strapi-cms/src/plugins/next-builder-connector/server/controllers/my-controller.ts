import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('next-builder-connector')
      .service('myService')
      .getWelcomeMessage();
  },
});
