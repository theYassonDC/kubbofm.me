import TableSchedules from "~/components/schedules/TableSchedules";
import type { Route } from "../+types/home";
import { tokenContext, userContext } from "~/context";
import { useLoaderData } from "react-router";

export async function loader({ context }: Route.LoaderArgs) {
  const token = context.get(tokenContext);
  const user = context.get(userContext);
  return { token, user };
}

export default function Schedules() {
  const { token, user } = useLoaderData<typeof loader>();
  return (
    <>
      <TableSchedules isPanel={true} token={token} user={user} />
    </>
  );
}
