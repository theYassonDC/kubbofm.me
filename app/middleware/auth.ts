import type { MiddlewareFunction } from "react-router";
import { netlifyRouterContext } from "@netlify/vite-plugin-react-router/serverless"
import { redirect } from "react-router";
import { userContext, tokenContext } from "~/context";
import { getAuthenticatedUser } from "~/libs/get-authenticated-user";

export const authMiddleware: MiddlewareFunction = async ({
  request,
  context,
}) => {
  const result = await getAuthenticatedUser(request);
  // const country =
  //   context.get(netlifyRouterContext).geo?.country?.name ?? "unknown";
  // console.log(
  //   `Handling ${request.method} request to ${request.url} from ${country}`,
  // );

  if (!result) {
    throw redirect("/panel/login");
  }

  context.set(userContext, result.user);
  context.set(tokenContext, result.token);
};
