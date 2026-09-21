import { NavLink, Outlet, useLoaderData, useLocation, useNavigate } from "react-router";
import type { Route } from "../+types/root";
import { authMiddleware } from "~/middleware/auth";
import { userContext } from "~/context";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

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

type Role = "admin" | "head" | "supervisor" | "dj" | "dj_auxiliar";

interface SubLink {
  url: string;
  name: string;
  roles: Role[];
}

interface NavLinkItem {
  url: string;
  name: string;
  roles: Role[];
  sublinks?: SubLink[];
}

const navList: NavLinkItem[] = [
  {
    url: "/panel/home",
    name: "Inicio",
    roles: ["admin", "head", "supervisor", "dj", "dj_auxiliar"],
  },
  {
    url: "/panel/schedules",
    name: "Horarios",
    roles: ["admin", "head", "supervisor", "dj", "dj_auxiliar"],
    sublinks: [
      {
        url: "/panel/schedules",
        name: "Tabla de horarios",
        roles: ["admin", "supervisor", "dj", "dj_auxiliar"],
      },
      {
        url: "/panel/schedules/users/list",
        name: "Horarios de usuarios",
        roles: ["admin", "supervisor"],
      },
    ],
  },
  { url: "/panel/users", name: "Usuarios", roles: ["admin", "supervisor"] },
  {
    url: "/panel/news",
    name: "Noticias",
    roles: ["admin", "head", "supervisor"],
    sublinks: [
      {
        url: "/panel/news/categories",
        name: "Categorías",
        roles: ["admin", "supervisor"],
      },
    ],
  },
];

interface NavItemProps {
  item: NavLinkItem;
  userRole: Role | undefined;
  currentPath: string;
}

function NavItem({ item, userRole, currentPath }: NavItemProps) {
  const visibleSublinks = (item.sublinks ?? []).filter((s) =>
    userRole ? s.roles.includes(userRole): false,
  );
  const hasSublinks = visibleSublinks.length > 0;

  // si el usuario ya está en una ruta hija, el grupo arranca abierto
  const isChildActive = visibleSublinks.some((s) =>
    currentPath.startsWith(s.url),
  );
  const [open, setOpen] = useState(isChildActive);

  if (!hasSublinks) {
    return (
      <li>
        <NavLink
          to={item.url}
          discover="render"
          className={({ isActive }) =>
            `block px-4 py-3 rounded-md transition-colors ${
              isActive
                ? "bg-slate-700 text-white"
                : "text-slate-200 hover:bg-slate-700"
            }`
          }
        >
          {item.name}
        </NavLink>
      </li>
    );
  }

  return (
    <li>
      <details
        className="group"
        open={open}
        onToggle={(e) => setOpen(e.currentTarget.open)}
      >
        <summary className="flex items-center justify-between cursor-pointer list-none marker:hidden [&::-webkit-details-marker]:hidden px-4 py-3 rounded-md text-slate-200 hover:bg-slate-700 transition-colors">
          <NavLink to={item.url} discover="render">{item.name}</NavLink>
          <svg
            className="w-4 h-4 shrink-0 transition-transform duration-200 group-open:rotate-180"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </summary>
        <ul className="mt-1 ml-4 pl-3 border-l border-slate-600 flex flex-col gap-1">
          {visibleSublinks.map((sub) => (
            <li key={sub.url}>
              <NavLink
                to={sub.url}
                discover="render"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive
                      ? "bg-slate-700 text-white"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`
                }
              >
                {sub.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </details>
    </li>
  );
}

export default function PanelLayout() {
  const { user } = useLoaderData();
  const navigate = useNavigate();
  const location = useLocation();

  const mutate = useMutation({
    mutationFn: async () => {
      const res = await fetch("/panel/logout", { method: "POST" });
      return res;
    },
    onSuccess: () => navigate("/panel/login"),
  });

  return (
    <div className="grid grid-cols-5 h-screen">
      <header className="col-span-1 flex flex-col items-center gap-10 h-full w-full bg-neutral-900">
        {user && (
          <div className="flex flex-col gap-1 mt-10">
            <div className="relative border-2 border-neutral-400 rounded-full h-30 w-30">
              <img
                src={user.figure_url}
                alt="avatar_img"
                className="absolute top-0 bottom-0 left-5"
              />
            </div>
            <p className="text-center text-2xl">{user.username}</p>
            <p className="text-red-800 text-center text-sm">{user.role}</p>
          </div>
        )}

        <button
          className="text-sm py-2 px-4 bg-red-500 cursor-pointer"
          onClick={() => mutate.mutate()}
        >
          Cerrar sesión
        </button>

        <ul className="flex flex-col gap-2 w-full px-2">
          {navList
            .filter((v) => v.roles.includes(user?.role))
            .map((v) => (
              <NavItem
                key={v.name}
                item={v}
                userRole={user?.role}
                currentPath={location.pathname}
              />
            ))}
        </ul>
      </header>

      <main className="col-span-4 col-start-2">
        <Outlet />
      </main>
    </div>
  );
}
