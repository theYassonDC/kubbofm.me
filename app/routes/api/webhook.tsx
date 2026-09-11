import { WEBHOOKS } from "~/config/containts";
import type { Route } from "../../+types/root";

export async function action({ request }: Route.ActionArgs) {
  const body = await request.json();
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const logs_type = searchParams.get("type");
  const content = body.content as string;

  if (!content) {
    return Response.json(
      { message: "El contenido es requerido" },
      { status: 400 },
    );
  }

  if (logs_type == "schedules") {
    const res = await fetch(WEBHOOKS.SCHEDULES_LOGS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("Error de Discord:", error);
      return Response.json(error, { status: res.status });
    }
  } else if (logs_type == "requets") {
    const res = await fetch(WEBHOOKS.REQUESTS_LOGS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("Error de Discord:", error);
      return Response.json(error, { status: res.status });
    }
  }

  return Response.json({ ok: true });
}
