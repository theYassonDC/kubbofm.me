import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { DEBUG, schedule_config } from "~/config/containts";
import { useEliminarHorario } from "~/hooks/useEliminarHorario";
import { useHorarios } from "~/hooks/useHorarios";
import { useRegistrarHorario } from "~/hooks/useRegistrarHorario";
import { useSemanaActual } from "~/hooks/useSemanaActual";
import { useWebhook } from "~/hooks/useWebhook";
import type {
  Franja,
  Horario,
  HorarioSeleccionado,
  MapaHorarios,
  Pais,
} from "~/libs/interface/horarios";

const detectarPais = (): Pais => {
  const zonaLocal = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return (
    schedule_config.PAISES.find((p) => p.zona === zonaLocal) ??
    schedule_config.PAISES[0]
  );
};

const getOffsetUTC = (zona: string): number => {
  const ahora = new Date();
  const enZona = new Date(ahora.toLocaleString("en-US", { timeZone: zona }));
  const enUTC = new Date(ahora.toLocaleString("en-US", { timeZone: "UTC" }));
  return Math.round((enZona.getTime() - enUTC.getTime()) / (1000 * 60 * 60));
};

const calcularDiferencia = (zonaRadio: string, zonaUsuario: string) =>
  getOffsetUTC(zonaUsuario) - getOffsetUTC(zonaRadio);

// Genera los rangos de hora: "12:00 A.M – 01:00 A.M", etc.
const generarFranjas = (offsetHoras: number = 0): Franja[] => {
  return Array.from({ length: 24 }, (_, horaLocal) => {
    const horaRadio = (((horaLocal - offsetHoras) % 24) + 24) % 24;
    const siguienteLocal = (horaLocal + 1) % 24;
    const fmt = (h: number) => {
      const n = ((h % 24) + 24) % 24;
      const periodo = n < 12 ? "A.M" : "P.M";
      const h12 = n === 0 ? 12 : n > 12 ? n - 12 : n;
      return `${String(h12).padStart(2, "0")}:00 ${periodo}`;
    };
    return { label: `${fmt(horaLocal)} – ${fmt(siguienteLocal)}`, horaRadio };
  });
};

const crearMapa = (horarios: Horario[]): MapaHorarios => {
  const mapa: MapaHorarios = {};
  horarios.forEach((h) => {
    mapa[`${h.dia}-${h.hora}`] = h;
  });
  return mapa;
};

interface HorariosGridProps {
  isPanel: boolean;
  token?: string;
  user?: User;
}
// ─── Componente ────────────────────────────────────────────────────────────────
export default function HorariosGrid(props: HorariosGridProps) {
  const [paisSeleccionado, setPaisSeleccionado] = useState<Pais>(detectarPais);
  const { semana, anio } = useSemanaActual(paisSeleccionado.zona);
  const { data: horarios = [], isLoading } = useHorarios(semana, anio);
  const { mutate: registrar, isPending: loadingHorario } = useRegistrarHorario(
    semana,
    anio,
    props.token,
  );
  const { mutate: eliminar, isPending: loadDeleting } = useEliminarHorario(
    semana,
    anio,
    props.token,
  );
  const { mutate: sendWebhook } = useWebhook();

  const [selected, setSelected] = useState<HorarioSeleccionado | null>(null);
  const [celdaCargando, setCeldaCargando] = useState<string | null>(null);
  const [filtroDia, setFiltroDia] = useState<number | null>(null);
  const offset = useMemo<number>(
    () => calcularDiferencia(schedule_config.ZONA_RADIO, paisSeleccionado.zona),
    [paisSeleccionado],
  );
  const franjas = useMemo(() => generarFranjas(offset), [offset]);
  const franjaSeleccionada = useMemo(
    () =>
      selected ? franjas.find((f) => f.horaRadio === selected.hora) : null,
    [franjas, selected],
  );
  const mapa = crearMapa(horarios);

  const diasVisibles =
    filtroDia !== null ? [filtroDia] : schedule_config.DAYS.map((_, i) => i);

  const handlePais = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const pais = schedule_config.PAISES.find((p) => p.zona === e.target.value);
    if (pais) setPaisSeleccionado(pais);
  };
  const timestand = Math.floor(Date.now() / 1000);
  const handleCeldaVacia = (diaIdx: number, horaRadio: number) => {
    setCeldaCargando(`${diaIdx}-${horaRadio}`);

    registrar(
      {
        dia: diaIdx,
        hora: horaRadio,
        style: "pink",
        semana,
        anio,
      },
      {
        onSettled: () => {
          setCeldaCargando(null);
          toast.success("Reserva tomada");
          if (DEBUG) {
            console.log("Reserva creada");
          } else {
            sendWebhook({
              content: `## Nuevo reserva <@&${schedule_config.discord.rolDjId}>\n> El usuario **${props.user?.username}** reservo una hora hoy <t:${timestand}:t> del dia ${schedule_config.DAYS[diaIdx]} en la tabla de horarios`,
              type: "schedules",
            });
          }
        },
      },
    );
  };

  const handleDeleteSchedule = (id: string, dia: number) => {
    eliminar(id, {
      onSettled: () => {
        setSelected(null);
        toast.success("Reserva eliminada");
        if (DEBUG) {
          console.log("Reserva eliminada");
        } else {
          sendWebhook({
            content: `## Reserva eliminada <@&${schedule_config.discord.rolDjId}>\n> El usuario **${props.user?.username}** quito la reserva hoy <t:${timestand}:t> del dia ${schedule_config.DAYS[dia]} en la tabla de horarios`,
            type: "schedules",
          });
        }
      },
    });
  };

  return (
    <div className="p-4 font-sans">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-4">
        <select
          value={paisSeleccionado.zona}
          onChange={handlePais}
          className="text-sm border border-gray-200 rounded-lg px-2 py-1.5"
        >
          {schedule_config.PAISES.map((p) => (
            <option key={p.zona} value={p.zona} className="text-black">
              {p.bandera} {p.nombre}
            </option>
          ))}
        </select>
        {/* Filtro rápido por día */}
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => setFiltroDia(null)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              filtroDia === null
                ? "bg-purple-500 text-white border-purple-500"
                : "border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white"
            }`}
          >
            Todos
          </button>
          {schedule_config.DAYS.map((day, i) => (
            <button
              key={day}
              onClick={() => setFiltroDia(filtroDia === i ? null : i)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                filtroDia === i
                  ? "bg-purple-500 text-white border-purple-500"
                  : "border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white"
              }`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scroll-smooth">
        <table className="border-collapse border border-gray-600 text-sm w-full">
          {/* Cabecera */}
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-purple-800 text-gray-300 text-xs font-medium px-3 py-3 text-left whitespace-nowrap border-r border-gray-600 min-w-36">
                Hora
              </th>
              {diasVisibles.map((i) => (
                <th
                  key={i}
                  className="bg-purple-800 text-white text-xs font-semibold px-3 py-3 text-center whitespace-nowrap border-r border-gray-700 min-w-32"
                >
                  {schedule_config.DAYS[i]}
                </th>
              ))}
            </tr>
          </thead>

          {/* Cuerpo */}

          <tbody>
            {isLoading ? (
              <tr className="bg-white text-black text-center">
                <td colSpan={8} rowSpan={10}>
                  <div className="text-center p-10">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-500 mx-auto"></div>
                    <h2 className="text-zinc-900 dark:text-zinc-600 mt-4">
                      Cargando tabla...
                    </h2>
                  </div>
                </td>
              </tr>
            ) : (
              franjas.map(({ label, horaRadio }, rowIdx) => (
                <tr
                  key={horaRadio}
                  className={rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  {/* Columna hora */}
                  <td className="sticky left-0 z-0 text-xs text-gray-500 px-3 py-2 border-r border-b border-gray-200 whitespace-nowrap font-medium bg-inherit">
                    {label}
                  </td>

                  {/* Celdas por día */}
                  {diasVisibles.map((diaIdx) => {
                    const horario = mapa[`${diaIdx}-${horaRadio}`];
                    const c = horario
                      ? schedule_config.COLORES[horario.color]
                      : null;
                    const key = `${diaIdx}-${horaRadio}`;
                    const estaCargandoEstaCelda =
                      loadingHorario && celdaCargando === key;
                    return (
                      <td
                        key={diaIdx}
                        className="px-2 py-1 border-r border-b border-gray-200 text-center"
                      >
                        {horario ? (
                          <button
                            onClick={() => setSelected({ ...horario, label })}
                            className="w-full rounded px-2 py-1 text-xs font-semibold cursor-pointer border transition-opacity hover:opacity-80"
                            style={{
                              backgroundColor: c!.bg,
                              color: c!.text,
                              borderColor: c!.border,
                            }}
                          >
                            {horario.djNombre}
                          </button>
                        ) : (
                          props.isPanel && (
                            <button
                              onClick={() =>
                                handleCeldaVacia(diaIdx, horaRadio)
                              }
                              disabled={loadingHorario}
                              className="cursor-pointer text-neutral-700 hover:text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {estaCargandoEstaCelda
                                ? "Cargando.."
                                : "Apuntarme"}
                            </button>
                          )
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal detalle */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-xl p-5 w-72 shadow-xl border-2"
            style={{
              borderColor: schedule_config.COLORES[selected.color].border,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  {schedule_config.DAYS[selected.dia]}
                </p>
                <h2 className="text-lg font-bold text-gray-900 mt-0.5">
                  {selected.djNombre}
                </h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-700 text-2xl leading-none bg-transparent border-none cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="space-y-2">
              {[
                { label: "Día", value: schedule_config.DAYS[selected.dia] },
                {
                  label: "Hora",
                  value: franjaSeleccionada?.label ?? selected.label,
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between pb-2 border-b border-gray-100"
                >
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50"
              >
                Cerrar
              </button>
              {props.isPanel && selected.user_id === props.user?.id && (
                <button
                  onClick={() =>
                    handleDeleteSchedule(selected.id, selected.dia)
                  }
                  disabled={loadDeleting}
                  className="px-4 py-2 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50"
                >
                  {loadDeleting ? "Eliminando.." : "Eliminar horario"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
