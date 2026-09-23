import { tokenContext } from "~/context";
import type { Route } from "../+types/home";
import { useLoaderData, useNavigate } from "react-router";
import { useRef, useState } from "react";
import {
  MDXEditor,
  type MDXEditorMethods,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  linkPlugin,
  linkDialogPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  ListsToggle,
  CreateLink,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { useCreateNew } from "~/hooks/useCreateNew";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "~/libs/radio.service";
import toast from "react-hot-toast";

export async function loader({ context }: Route.LoaderArgs) {
  const token = context.get(tokenContext);
  return { token };
}

export default function NewsCreatePage() {
  const { token } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const editorRef = useRef<MDXEditorMethods>(null);
  const [title, setTitle] = useState("");
  const [category_id, setCategoryId] = useState("");
  const [image_url, setImageUrl] = useState("");
  const [isReadOnly, setReadOnly] = useState(false);
  const { mutate, isPending, isSuccess } = useCreateNew();

  const { data: dataCategories, isLoading: isLoadCategories } = useQuery({
    queryKey: ["categories-data"],
    queryFn: () =>
      getCategories({
        limit: "10",
        page: "1",
      }),
  });

  async function handleSave() {
    const markdown = editorRef.current?.getMarkdown() ?? "";
    mutate({
      body: {
        category_id,
        title,
        content: markdown,
        image_url,
      },
      token: token!,
    }, {
      onSuccess: () => {
        toast.success("¡Noticia creada correctamente!");
        navigate('/panel/news')
      }
    });
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-3 items-center">
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-lg">
            Titulo
          </label>
          <input
            type="text"
            id="title"
            onChange={(e) => setTitle(e.target.value)}
            className="appearance-none 
        bg-slate-800 border border-slate-700 text-slate-100 
        text-sm h-11 rounded-lg pl-3.5 pr-9 
        hover:border-slate-600 focus:outline-none focus:ring-1 
        focus:ring-sky-400 focus:border-sky-400 transition-colors"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="categories" className="text-lg">
            Categoria
          </label>
          <select
            id="categories"
            onChange={(e) => setCategoryId(e.target.value)}
            className="appearance-none 
        bg-slate-800 border border-slate-700 text-slate-100 
        text-sm h-11 rounded-lg pl-3.5 pr-9 
        hover:border-slate-600 focus:outline-none focus:ring-1 
        focus:ring-sky-400 focus:border-sky-400 transition-colors"
          >
            <option selected>Selecciona una categoria</option>
            {dataCategories?.data ? (
              dataCategories?.data.map((v) => (
                <option value={v.id}>{v.name}</option>
              ))
            ) : (
              <option value="#">No hay categorias</option>
            )}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="image" className="text-lg">
            Imagen de portada url
          </label>
          <input
            type="text"
            id="image"
            onChange={(e) => setImageUrl(e.target.value)}
            className="appearance-none 
        bg-slate-800 border border-slate-700 text-slate-100 
        text-sm h-11 rounded-lg pl-3.5 pr-9 
        hover:border-slate-600 focus:outline-none focus:ring-1 
        focus:ring-sky-400 focus:border-sky-400 transition-colors"
          />
        </div>
      </div>
      <div className="flex items-center">
        <button
          className={
            isReadOnly
              ? "px-4 py-2 bg-slate-700 hover:bg-slate-800 rounded-tl-3xl rounded-bl-3xl"
              : "px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-tl-3xl rounded-bl-3xl"
          }
          onClick={() => setReadOnly(false)}
        >
          Editor
        </button>
        <button
          className={
            isReadOnly
              ? "px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-tr-3xl rounded-br-3xl"
              : "px-4 py-2 bg-slate-700 hover:bg-slate-800 rounded-tr-3xl rounded-br-3xl"
          }
          onClick={() => setReadOnly(true)}
        >
          Visualizar
        </button>
      </div>
      <MDXEditor
        ref={editorRef}
        markdown=""
        className="bg-white"
        readOnly={isReadOnly}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <>
                {isReadOnly ? null : (
                  <>
                    <UndoRedo />
                    <BoldItalicUnderlineToggles />
                    <BlockTypeSelect />
                    <ListsToggle />
                    <CreateLink />
                  </>
                )}
              </>
            ),
          }),
        ]}
      />
      <button
        onClick={handleSave}
        className="mt-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md cursor-pointer"
      >
        {isPending ? "Guardando.." : "Guardar noticia"}
      </button>
    </div>
  );
}
