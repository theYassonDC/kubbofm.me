import { tokenContext } from "~/context";
import type { Route } from "../+types/home";
import { useLoaderData } from "react-router";
import { useSchedulesByUser } from "~/hooks/useSchedulesByUser";
import { useState } from "react";
import { useSemanaActual } from "~/hooks/useSemanaActual";
import { calcularProgreso } from "~/libs/utils/calcularProgeso";

export async function loader({ context }: Route.LoaderArgs) {
  const token = context.get(tokenContext);
  return { token };
}

export default function SchedulesUsers() {
  const { token } = useLoaderData<typeof loader>();
  const { anio, semana } = useSemanaActual();

  const [mes, setMes] = useState(0);
  const [anioSelect, setAnioSelect] = useState(anio);
  const [semanaSelect, setSemanaSelect] = useState(semana);

  const { data, page, setPage, isLoading } = useSchedulesByUser(token!, {
    anio: anioSelect,
    mes,
    semana: semanaSelect,
  });
  const semanas = Array.from({ length: 52 }, (_, i) => i + 1);
  const meses = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleChangeSemana = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSemanaSelect(Number(e.target.value));
  };
  const handleChangeMes = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMes(Number(e.target.value));
  };
  const handleChangeAnio = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAnioSelect(Number(e.target.value));
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex gap-2 items-center">
        <select
          name="semana"
          id="semana"
          onChange={handleChangeSemana}
          className="appearance-none 
        bg-slate-900 border border-slate-700 text-slate-100 
        text-sm h-11 rounded-lg pl-3.5 pr-9 cursor-pointer 
        hover:border-slate-600 focus:outline-none focus:ring-1 
        focus:ring-sky-400 focus:border-sky-400 transition-colors"
        >
          <option selected>Selecciona el numero de semana</option>
          {semanas.map((semana) =>
            semana == semanaSelect ? (
              <option key={semana} value={semana} selected>
                Semana {semana} (Actual)
              </option>
            ) : (
              <option key={semana} value={semana}>
                Semana {semana}
              </option>
            ),
          )}
        </select>
        <select
          name="meses"
          id="mes"
          onChange={handleChangeMes}
          className="appearance-none 
        bg-slate-900 border border-slate-700 text-slate-100 
        text-sm h-11 rounded-lg pl-3.5 pr-9 cursor-pointer 
        hover:border-slate-600 focus:outline-none focus:ring-1 
        focus:ring-sky-400 focus:border-sky-400 transition-colors"
        >
          {meses.map((mes) => (
            <option value={mes} key={mes}>
              Mes #{mes}
            </option>
          ))}
        </select>
        <select
          name="anio"
          id="anio"
          onChange={handleChangeAnio}
          value={anioSelect}
          className="appearance-none 
        bg-slate-900 border border-slate-700 text-slate-100 
        text-sm h-11 rounded-lg pl-3.5 pr-9 cursor-pointer 
        hover:border-slate-600 focus:outline-none focus:ring-1 
        focus:ring-sky-400 focus:border-sky-400 transition-colors"
        >
          <option value="2026">Año 2026</option>
          <option value="2027">Año 2027</option>
          <option value="2028">Año 2028</option>
          <option value="2029">Año 2029</option>
          <option value="2030">Año 2030</option>
        </select>
      </div>
      <table className="table-fixed border-collapse border border-neutral-400 text-center bg-neutral-600">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Horas semanales</th>
            <th>Horas semanales faltantes</th>
            <th>Horas extras faltantes</th>
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
            data?.data.map((val) => (
              <tr className="border border-neutral-400" key={val.username}>
                <td>{val.username}</td>
                <td>{val.total_hours}</td>
                <td>{calcularProgreso(val.total_hours).minimo.faltanteHoras}</td>
                <td>{calcularProgreso(val.total_hours).extra.faltanteHoras}</td>
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
