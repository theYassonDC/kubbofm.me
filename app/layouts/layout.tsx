import Navbar from "~/components/Navbar";
import { Outlet } from "react-router";
import Playerbar from "~/components/Playerbar";
import type { Route } from "./+types/layout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "KubboFM ~ La radio que enciende corazones" },
    { name: "description", content: "Bienvenido de vuelta a la mejor radio de kubbo.me" },
  ];
}

export default function LayoutWeb() {
  return (
    <>
      <Navbar />
      <main className="h-screen">
        <Outlet />
      </main>
      <Playerbar />
    </>
  );
}
