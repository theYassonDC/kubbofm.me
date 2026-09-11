import CarruselNews from "~/components/news/Carrusel";
import type { Route } from "./+types/home";
import RequestsForm from "~/components/RequestsForm";
// import { Form } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "KubboFM ~ La radio que enciende corazones" },
    { name: "description", content: "Bienvenido de vuelta a la mejor radio de kubbo.me" },
  ];
}

export default function Home() {
  return (
    <>
      <h1 className="p-4 text-2xl text-center">
        ¡Bienvenido a KubboFM!
      </h1>
      <CarruselNews />
      <br />
      <br />
      <RequestsForm />
      <br />
      <br />
      <br />
    </>
  );
}
