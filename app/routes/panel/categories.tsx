import { tokenContext, userContext } from "~/context";
import type { Route } from "../+types/home";
import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from "~/libs/radio.service";
import { useLoaderData } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { queryClient } from "~/libs/queyClient";
import toast from "react-hot-toast";

export async function loader({ context }: Route.LoaderArgs) {
  const token = context.get(tokenContext);
  return { token };
}

export default function UsersPage() {
  const [modal, setModal] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("")
  const [selectedCategoryId, setSelectedCategoryId] = useState("")
  const { token } = useLoaderData<typeof loader>();
  const queryClient = useQueryClient();

  const { data: dataCategories, isLoading: isLoadCategories } = useQuery({
    queryKey: ["categories-data", limit, page],
    queryFn: () =>
      getCategories({
        limit: String(limit),
        page: String(page),
      }),
  });
  const handleCancel = () => {
    setModal(false);
    setName("")
    setDescription("")
    setSelectedCategoryId("")
    setModalEdit(false);
  };
  const createCategoryMutation = useMutation({
    mutationFn: async () => {
      const data = {
        name,
        description
      };
      if (token) {
        const res = await createCategory(data, token);
        return res;
      }
    },
    onSuccess: () => {
      toast.success("Categoria creada registrado correctamente");
      queryClient.invalidateQueries({ queryKey: ["categories-data"] });
    },
  });
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      if (token) {
        deleteCategory(id, token);
      }
    },
    onSuccess: () => {
      toast.success("Categoria eliminado correctamente");
      queryClient.invalidateQueries({ queryKey: ["categories-data"] });
    },
  });
  const updateCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      if (token) {
        const data = {
            name,
            description
        };
        const res = await updateCategory(id, data, token);
        return res;
      }
    },
    onSuccess: () => {
      toast.success("Categoria actualizada correctamente");
      queryClient.invalidateQueries({ queryKey: ["categories-data"] });
    },
  });
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    createCategoryMutation.mutate();
    setModal(false);
  };
  const handleDelete = async (id: string) => {
    const res = confirm("¿Estas seguro que quieres borrar esta categoria?");
    if (res) {
      deleteCategoryMutation.mutate(id);
    }
  };

  const handleEdit = useCallback(
    async (id: string) => {
      setModalEdit(true);
      const data = await queryClient.fetchQuery({
        queryKey: ["category", id],
        queryFn: () => getCategory(token!, id),
      });
      if (data) {
        setName(data.name)
        setDescription(data.description)
      }
    },
    [token, queryClient],
  );

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    updateCategoryMutation.mutate(selectedCategoryId!);
    handleCancel();
  };
  return (
    <div className="flex flex-col gap-4 p-2">
      <div className="flex gap-2 items-center">
        <button
          className="px-4 py-2 bg-green-500 border border-green-700 rounded-2xl hover:bg-green-700 cursor-pointer"
          onClick={() => setModal(true)}
        >
          Crear categoria
        </button>
        <select
          className="px-4 py-2 bg-neutral-500 border-2 border-neutral-200 outline-0 rounded-lg"
          onChange={(e) => setLimit(Number(e.target.value))}
        >
          <option value={1}>Numero de categorias para ver</option>
          <option value={5}>Mostrar 5</option>
          <option value={10}>Mostrar 10</option>
          <option value={15}>Mostrar 15</option>
          <option value={20}>Mostrar 20</option>
        </select>
      </div>
      <table className="table-fixed border-collapse border border-neutral-400 text-center bg-neutral-600">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripcion</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {isLoadCategories ? (
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
            dataCategories!.data
              .map((v) => (
                <tr className="border border-neutral-400">
                  <td>{v.name}</td>
                  <td>{v.description}</td>
                  <td className="py-2">
                    <button
                      className="px-4 py-2 bg-green-700 rounded-2xl cursor-pointer hover:bg-green-600 disabled:bg-green-800 disabled:cursor-no-drop"
                      onClick={() => {
                        setSelectedCategoryId(v.id)
                        handleEdit(v.id);
                      }}
                    >
                      Editar
                    </button>
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
          onClick={() => setPage(dataCategories!.prev_page_url != null ? page - 1 : 1)}
          className="w-auto px-4 h-9 rounded-lg border border-white/20 flex items-center justify-center text-white hover:bg-purple-500/10 transition-colors"
        >
          <img src="/assets/PiconLeft.svg" alt="right" width={12} />
          Anterior
        </button>
        <button
          aria-label="Siguiente"
          onClick={() => setPage(dataCategories!.next_page_url != null ? page + 1 : 1)}
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
        {modal && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50"
            onClick={() => setModal(false)}
          >
            <div
              className="bg-neutral-900 rounded-xl p-5 w-1/2 h-2/3 shadow-xl border-2 border-neutral-800 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <form
                className="flex flex-col justify-center gap-3"
                onSubmit={handleSubmit}
              >
                <div className="flex flex-col gap-1">
                  <label htmlFor="name" className="text-xs text-neutral-400">
                    Nombre de la categoria
                  </label>
                  <input
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    className="px-4 py-2 bg-neutral-500 border-2 border-neutral-200 outline-0 rounded-lg"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="Schedule title"
                    className="text-xs text-neutral-400"
                  >
                    Descripcion
                  </label>
                  <input
                    type="text"
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    className="px-4 py-2 bg-neutral-500 border-2 border-neutral-200 outline-0 rounded-lg"
                  />
                </div>
                <div className="flex gap-2 items-end w-full mt-10">
                  <button
                    className="px-4 py-2 bg-green-500 rounded-2xl cursor-pointer hover:bg-green-600"
                    type="submit"
                  >
                    Crear
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 rounded-2xl cursor-pointer hover:bg-red-600"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {modalEdit && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50"
            onClick={() => setModalEdit(false)}
          >
            <div
              className="bg-neutral-900 rounded-xl p-5 w-1/2 h-2/3 shadow-xl border-2 border-neutral-800 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <form
                className="flex flex-col justify-center gap-3"
                onSubmit={handleUpdate}
              >
                <div className="flex flex-col gap-1">
                  <label htmlFor="name" className="text-xs text-neutral-400">
                    Nombre de usuario
                  </label>
                  <input
                    type="text"
                    value={name ?? "Cargando.."}
                    onChange={(e) => setName(e.target.value)}
                    className="px-4 py-2 bg-neutral-500 border-2 border-neutral-200 outline-0 rounded-lg"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="Schedule title"
                    className="text-xs text-neutral-400"
                  >
                    Descripcion
                  </label>
                  <input
                    type="text"
                    onChange={(e) => setDescription(e.target.value)}
                    value={description ?? "Cargando.."}
                    className="px-4 py-2 bg-neutral-500 border-2 border-neutral-200 outline-0 rounded-lg"
                  />
                </div>
                <div className="flex gap-2 items-end w-full mt-10">
                  <button
                    className="px-4 py-2 bg-green-500 rounded-2xl cursor-pointer hover:bg-green-600"
                    type="submit"
                  >
                    Guardar
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 rounded-2xl cursor-pointer hover:bg-red-600"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
