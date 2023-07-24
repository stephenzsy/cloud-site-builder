import { Strapi } from "@strapi/strapi";
import { errors as strapiErrors } from "@strapi/utils";
const { ForbiddenError, UnauthorizedError } = strapiErrors;

const actions = [
  { action: "api::block.block.find" },
  { action: "api::block.block.findOne" },
];

export default async ({ strapi }: { strapi: Strapi }) => {
  // registeration phase

  strapi.container.get("auth").register("content-api", {
    name: "next-builder-connector",
    authenticate: async (ctx) => {
      const parseResult = strapi
        .plugin("next-builder-connector")
        .service("jwt")
        .getToken(ctx);

      if (!parseResult) {
        return { authenticated: false };
      }
      try {
        const parsed = await parseResult;
        if (!parsed) {
          return { authenticated: false };
        }

        const ability =
          await strapi.contentAPI.permissions.engine.generateAbility(actions);
        return {
          authenticated: true,
          ability,
        };
      } catch (err) {
        return { authenticated: false };
      }
    },
    verify: async (auth, config) => {
      const { ability } = auth;
      if (!config.scope || config.scope.length === 0 || !ability) {
        // special role cannot access routes that do not have a scope
        throw new UnauthorizedError();
      }

      const isAllowed = config.scope.every((s) => ability.can(s));

      if (!isAllowed) {
        throw new ForbiddenError();
      }
    },
  });
};
