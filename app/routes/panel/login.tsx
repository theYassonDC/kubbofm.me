import { auth } from "~/libs/auth.service";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import type { Route } from "./+types/login";
import { commitSession, getSession } from "~/sessions.server";
import { guestMiddleware } from "~/middleware/guest";

export const middleware: Route.MiddlewareFunction[] = [guestMiddleware];

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const res = await auth({ username, password });

  if (!res) {
    return Response.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  const session = await getSession(request.headers.get("Cookie"));
  session.set("token", res.token);

  return Response.json(
    { success: true, user: res.user },
    { headers: { "Set-Cookie": await commitSession(session) } },
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      const formData = new FormData();
      formData.set("password", password);
      formData.set("username", username);
      const res = fetch("/panel/login", {
        method: "POST",
        body: formData,
      });

      if (!res) {
        throw new Error("Error al iniciar sesión");
      }

      return res;
    },
    onSuccess: () => {
      navigate("/panel/home");
    },
  });

  function handleSubmit(e: React.ChangeEvent) {
    e.preventDefault();
    loginMutation.mutate({ username, password });
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-5 justify-center h-screen"
      >
        <h1 className="text-2xl font-bold">YassonFM Panel v1.0</h1>
        <h2 className="text-sm text-neutral-700">Inicia sesion para ingresar al panel</h2>
        <input
          type="username"
          name="username"
          placeholder="Nombre de usuario hobbaz"
          className="px-4 py-2 bg-neutral-500 border-2 border-neutral-200 outline-0 rounded-lg"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          className="px-4 py-2 bg-neutral-500 border-2 border-neutral-200 outline-0 rounded-lg"
          placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="px-8 py-4 bg-green-500 rounded-2xl hover:bg-green-600 cursor-pointer"
        >
          {loginMutation.isPending ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </form>
    </>
  );
}
