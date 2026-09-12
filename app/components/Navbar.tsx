import { NavLink } from "react-router";

const endpoints = [
  { href: "/", name: "Inicio" },
  // { href: "/news", name: "Noticias" },
  { href: "/schedules", name: "Horarios" },
  { href: "/team", name: "Equipo" },
];

export default function Navbar() {
  return (
    <header>
      <div className="relative">
        <img src="/assets/banner.png" alt="banner" />
        <img src="/assets/logo_radio_kubbo.png" alt="logo" className="absolute top-0 bottom-0 left-0 right-0 m-auto md:w-96 w-30"/>
      </div>
      <nav className="px-8 py-4 bg-neutral-950 flex items-center">
        <ul className="flex flex-wrap gap-4 py-2 flex-1">
          {endpoints.map((v) => (
            <NavLink to={v.href}>
              {({ isActive, isPending, isTransitioning }) => (
                <span
                  className={isActive ? "text-purple-300" : "text-neutral-400"}
                >
                  {v.name}
                </span>
              )}
            </NavLink>
          ))}
        </ul>
      </nav>
    </header>
  );
}
