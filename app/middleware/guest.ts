// app/middleware/guest.ts
import { redirect, type MiddlewareFunction } from "react-router";
import { getAuthenticatedUser } from "~/libs/get-authenticated-user";
import { netlifyRouterContext } from "@netlify/vite-plugin-react-router/serverless"

export const guestMiddleware: MiddlewareFunction = async ({ request, context }) => {
  const result = await getAuthenticatedUser(request);
  // const country =
  //   context.get(netlifyRouterContext).geo?.country?.name ?? "unknown";
  // console.log(
  //   `Handling ${request.method} request to ${request.url} from ${country}`,
  // );

  if (result) {
    throw redirect("/panel/home");
  }
};