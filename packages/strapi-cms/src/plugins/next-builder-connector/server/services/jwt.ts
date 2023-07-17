import { Strapi } from "@strapi/strapi";
import jwt from "jsonwebtoken";

export interface IJwtService {
  getToken(ctx: { request: any }): Promise<{ sub?: unknown }> | undefined;
  verify(token: string);
}

const jwtSubject = "next-builder-reader";

export default function serviceFactory({
  strapi,
}: {
  strapi: Strapi;
}): IJwtService {
  return {
    getToken(ctx: { request?: any }): Promise<{ sub?: unknown }> | undefined {
      let token;

      if (
        ctx.request &&
        ctx.request.header &&
        ctx.request.headers.authorization
      ) {
        const parts = ctx.request.header.authorization.split(/\s+/);

        if (parts[0].toLowerCase() !== "bearer" || parts.length !== 2) {
          return;
        }

        token = parts[1];
      } else {
        return;
      }

      return this.verify(token);
    },
    verify(token): Promise<{ sub?: unknown }> {
      return new Promise((resolve, reject) => {
        jwt.verify(
          token,
          strapi.config.get("plugin.next-builder-connector.jwtSecret"),
          { subject: jwtSubject },
          (err, tokenPayload = {}) => {
            if (err) {
              reject(new Error("Invalid token."));
            }
            resolve(tokenPayload);
          }
        );
      });
    },
  };
}
