import { NavLink, Outlet, useLoaderData, useNavigate } from "react-router";
import type { Route } from "../+types/root";
import { authMiddleware } from "~/middleware/auth";
import { userContext } from "~/context";
import { useMutation } from "@tanstack/react-query";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "KubboFM ~ Panel" },
    { name: "description", content: "Panel de gestion de djs" },
  ];
}

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const user = context.get(userContext);
  return { user };
}
const navList = [
  {
    url: "/panel/home",
    name: "Inicio",
    roles: ["admin", "head", "supervisor", "dj", "dj_auxiliar"],
  },
  {
    url: "/panel/schedules",
    name: "Horarios",
    roles: ["admin", "head", "supervisor", "dj", "dj_auxiliar"],
  },
  { url: "/panel/users", name: "Usuarios", roles: ["admin", "supervisor"] },
  { url: "/panel/schedules/users/list", name: "Horarios de usuarios", roles: ["admin", "supervisor"] },
  {
    url: "/panel/news",
    name: "Noticias",
    roles: ["admin", "head", "supervisor"],
  },
  // {
  //   url: "/panel/events",
  //   name: "Eventos",
  //   roles: ["admin", "head", "supervisor"],
  // },
];
export default function PanelLayout() {
  const { user } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const mutate = useMutation({
    mutationFn: async () => {
      const res = await fetch("/panel/logout", {
        method: "POST",
      });
      return res;
    },
    onSuccess: () => {
      navigate('/panel/login')
    }
  });
  function sdsd() {
    mutate.mutate();
  }
  return (
    <div className="grid grid-cols-5 h-screen">
      <header className="col-span-1 flex flex-col items-center gap-10 h-full w-full bg-neutral-900">
        {user && (
          <>
            <div className="flex flex-col gap-1 mt-10">
              <div className="relative border-2 border-neutral-400 rounded-full h-30 w-30">
                <img
                  src={`${user!.figure_url}`}
                  alt="avatar_img"
                  className="absolute top-0 bottom-0 left-5"
                />
              </div>
              <p className="text-center text-2xl">{user.username}</p>
              <p className="text-red-800 text-center text-sm">{user.role}</p>
            </div>
          </>
        )}
        <button
          className="text-sm py-2 px-4 bg-red-500 cursor-pointer"
          onClick={sdsd}
        >
          Cerrar sesion
        </button>
        <ul className="flex flex-col gap-2 w-full">
          {navList.map((v) => (
            <>
              {v.roles?.includes(user!.role) ? (
                <NavLink to={v.url} discover="render" key={v.name}>
                  {({ isActive, isPending, isTransitioning }) => (
                    <>
                      <p
                        className={
                          isActive
                            ? "text-white px-2 py-2 bg-neutral-600"
                            : "text-white px-2 py-2 hover:bg-neutral-600 w-full"
                        }
                      >
                        {v.name}
                      </p>
                    </>
                  )}
                </NavLink>
              ) : null}
            </>
          ))}
        </ul>
      </header>
      <main className="col-span-4 col-start-2">
        <Outlet />
      </main>
    </div>
  );
}
