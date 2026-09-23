import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { NavLink, useLoaderData } from "react-router";
import { deleteNew, getNews } from "~/libs/radio.service";
import type { Route } from "../+types/home";
import { tokenContext } from "~/context";
import toast from "react-hot-toast";

export async function loader({ context }: Route.LoaderArgs) {
  const token = context.get(tokenContext);
  return { token };
}

export default function NewsPage() {
  const { token } = useLoaderData<typeof loader>();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["news", page, limit],
    queryFn: () =>
      getNews({
        limit: String(limit),
        page: String(page),
      }),
  });
  const deleteMutationNew = useMutation({
    mutationFn: async ({id, token}: { id: string, token: string}) => deleteNew(id, token!),
    onSuccess: () => {
      toast.success("Noticia eliminada correctamente!");
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
  const handleEdit = (id: string) => {};
  const handleDelete = (id: string) => {
    const res = confirm("¿Estas seguro que quieres borrar esta noticia?");
    if (res) {
      deleteMutationNew.mutate({ id, token: token! })
    }
  };
  return (
    <div className="flex flex-col w-full gap-3">
      <div className="flex items-center gap-2">
        <NavLink
          to={"/panel/news/create"}
          className="px-4 py-2 bg-green-500 text-white rounded-2xl border-2 border-green-600 hover:bg-green-600"
        >
          Crear una nueva noticia
        </NavLink>
        <select
          name="limit"
          onChange={(v) => setLimit(Number(v.target.value))}
          className="appearance-none 
        bg-slate-900 border border-slate-700 text-slate-100 
        text-sm h-11 rounded-lg pl-3.5 pr-9 cursor-pointer 
        hover:border-slate-600 focus:outline-none focus:ring-1 
        focus:ring-sky-400 focus:border-sky-400 transition-colors"
        >
          <option value="10" selected>Numbero de filas</option>
          <option value="5">5</option>
          <option value="10">10</option>
        </select>
      </div>
      <table className="table-fixed border-collapse border border-neutral-400 text-center bg-neutral-600">
        <thead>
          <tr>
            <th>Titulo</th>
            <th>Autor</th>
            <th>Categoria</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr className="text-center">
              <td colSpan={8} rowSpan={10}>
                <div className="text-center p-10">
                  <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-500 mx-auto"></div>
                  <h2 className="text-zinc-300 dark:text-zinc-200 mt-4">
                    Cargando tabla...
                  </h2>
                </div>
              </td>
            </tr>
          ) : (
            data?.data.map((v) => (
              <tr className="border border-neutral-400">
                <td>{v.title}</td>
                <td>{v.author.username}</td>
                <td>{v.category.name}</td>
                <td>
                  <NavLink to={`/panel/news/edit/${v.id}`}
                    className="px-4 py-2 bg-green-700 rounded-2xl cursor-pointer hover:bg-green-600 disabled:bg-green-800 disabled:cursor-no-drop"
                  >
                    Editar
                  </NavLink>
                  <button
                    onClick={() => handleDelete(v.id)}
                    className="px-4 py-2 bg-red-500 rounded-2xl cursor-pointer hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="flex gap-2 items-center w-full justify-center">
        <button
          aria-label="Siguiente"
          onClick={() => setPage(data!.prev_page_url != null ? page - 1 : 1)}
          className="w-auto px-4 h-9 rounded-lg border border-white/20 flex items-center justify-center text-white hover:bg-purple-500/10 transition-colors"
        >
          <img src="/assets/PiconLeft.svg" alt="right" width={12} />
          Anterior
        </button>
        <button
          aria-label="Siguiente"
          onClick={() => setPage(data!.next_page_url != null ? page + 1 : 1)}
          className="w-auto px-4 h-9 rounded-lg border border-white/20 flex items-center justify-center text-white hover:bg-purple-500/10 transition-colors"
        >
          Siguiente
          <img
            src="/assets/PiconLeft.svg"
            alt="right"
            width={12}
            className="rotate-180"
          />
        </button>
      </div>
    </div>
  );
}
