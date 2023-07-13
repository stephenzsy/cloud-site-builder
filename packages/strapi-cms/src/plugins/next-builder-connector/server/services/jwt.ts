import { Strapi } from "@strapi/strapi";
import { sign } from "jsonwebtoken";

export interface IJwtService {
  readonly issueContentReadToken: () => string;
}

const jwtSubject = "next-builder-reader";

export default function serviceFactory({
  strapi,
}: {
  strapi: Strapi;
}): IJwtService {
  return {
    issueContentReadToken() {
      return sign(
        { sub: jwtSubject },
        // use the same secret for now
        strapi.config.get("plugin.users-permissions.jwtSecret"),
        { expiresIn: "7d" }
      );
    },
  };
}
