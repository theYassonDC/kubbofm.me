import { queryClient } from "~/libs/queyClient";
import type { Route } from "./+types/news.$id";
import { getNewById } from "~/libs/radio.service";
import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  await queryClient.ensureQueryData({
    queryKey: ["news", params.id],
    queryFn: () => getNewById(params.id),
  });
  return null;
}

export default function NewPage({ params }: Route.ComponentProps) {
  const { data } = useQuery({
    queryKey: ["new", params.id],
    queryFn: () => getNewById(params.id),
  });

  if (!data) return null;
  return (
    <div className="flex flex-col">
      <div className="relative h-72">
        <div className="w-full h-full bg-linear-to-t from-black from-10% to-transparent absolute z-10"></div>
        <img
          src={data.image_url}
          alt="new.ssds"
          className="h-72 w-full object-cover absolute"
        />
      </div>
      <article className="flex flex-col gap-3 pl-4">
        <h1 className="text-3xl font-bold">{data.title}</h1>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.content}</ReactMarkdown>
        <NavLink to="/news" className="px-4 py-2 text-fuchsia-100 hover:text-fuchsia-500">{'<'} Volver a las noticias</NavLink>
      </article>
    </div>
  );
}
