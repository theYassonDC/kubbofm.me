import { useState } from "react";
import useAttempts from "~/hooks/useAttempts";
import useLocalStorage from "~/hooks/useLocalStorage";
import { useWebhook } from "~/hooks/useWebhook";

const MAX_ATTEMPS = 5;
export default function RequestsForm() {
  const { mutate: sendWebhook, isSuccess, isPending } = useWebhook();
  const { attempts, increment } = useAttempts('client_requests');
  const [requestBy, setRequestBy] = useState("request_name");
  const [name, setName] = useState("");
  const [peticion, setPeticion] = useState("");

  function handleSubmit(e: React.ChangeEvent) {
    e.preventDefault();
    increment()
    if (attempts >= MAX_ATTEMPS) return;
    if (!peticion) return;
    if (requestBy === "request_anonimo") {
      sendWebhook({
        content: `# Nueva peticion recibida desde la web\nUn usuario **\`anonimo\`** realizo la siguiente peticion:\n> ${peticion}`,
        type: "requets",
      });
    } else {
      if (!name) return;

      sendWebhook({
        content: `# Nueva peticion recibida desde la web\nEl usuario **\`${name}\`** anonimo realizo la siguiente peticion:\n> ${peticion}`,
        type: "requets",
      });
    }

  }
  return (
    <section className="flex flex-col gap-3 items-center">
      <h1 className="text-3xl">¡Pide tu cancion o dedicatoria!</h1>
      <form
        className="flex flex-col gap-4 items-center"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="type_request">¿Como quieres hacer la peticion?</label>
          <select
            id="type_request"
            onChange={(e) => setRequestBy(e.target.value)}
            className="appearance-none 
        bg-slate-800 border border-slate-700 text-slate-100 
        text-sm h-11 rounded-lg pl-3.5 pr-9 cursor-pointer 
        hover:border-slate-600 focus:outline-none focus:ring-1 
        focus:ring-sky-400 focus:border-sky-400 transition-colors"
          >
            <option value="request_anonimo">Anonimo</option>
            <option value="request_name" selected>
              Nombre
            </option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          {requestBy === "request_name" ? (
            <>
              <label htmlFor="username">Escribe tu nombre</label>
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                className="appearance-none 
        bg-slate-800 border border-slate-700 text-slate-100 
        text-sm h-11 rounded-lg pl-3.5 pr-9 
        hover:border-slate-600 focus:outline-none focus:ring-1 
        focus:ring-sky-400 focus:border-sky-400 transition-colors"
              />
            </>
          ) : null}
        </div>
        <textarea
          placeholder="Escribe tu peticion"
          onChange={(e) => setPeticion(e.target.value)}
          className="bg-slate-800 rounded-lg border border-slate-700 text-slate-100 focus:outline-none px-4 py-2 w-full"
        ></textarea>
        {attempts >= MAX_ATTEMPS ? (
          <button
            disabled={true}
            className="px-4 py-2 bg-green-600/40 rounded-2xl cursor-no-drop text-green-300 font-semibold"
          >
            ¡Ya enviaste muchas peticiones!
          </button>
        ) : (
          <>
            <button
              disabled={isPending}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-2xl cursor-pointer text-white font-semibold"
            >
              {isPending ? "Enviando.." : "Enviar peticion"}
            </button>
          </>
        )}
      </form>
    </section>
  );
}
