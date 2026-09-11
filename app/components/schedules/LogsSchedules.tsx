import { useQuery } from "@tanstack/react-query";
import { getLogs } from "~/libs/radio.service";

function timeAgo(timestamp: string) {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(timestamp).getTime()) / 1000,
  );

  const intervals = [
    { label: "a", seconds: 31536000 },
    { label: "m", seconds: 2592000 },
    { label: "d", seconds: 86400 },
    { label: "h", seconds: 3600 },
    { label: "m", seconds: 60 },
  ];

  for (const { label, seconds: intervalSeconds } of intervals) {
    const count = Math.floor(seconds / intervalSeconds);
    if (count >= 1) return `hace ${count}${label}`;
  }

  return "hace unos segundos";
}

interface PropsLogsSchedules {
  token: string;
}
export default function LogsSchedules(props: PropsLogsSchedules) {
  const {
    data: logs,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["logs_panel"],
    queryFn: () => getLogs(props.token),
  });
  return (
    <>
      <div className="flex flex-col items-start gap-2 w-full col-span-3 self-end">
        <div className="flex items-center w-full px-5">
          <h2 className="text-lg text-start flex-8">
            Ultimos horarios registrados
          </h2>
          <button 
          className="flex-auto px-2 py-2 bg-purple-500 hover:bg-purple-700 text-white rounded-3xl cursor-pointer w-auto"
          onClick={() => refetch()}
          disabled={isFetching}
          >
            {isFetching 
            ? <div className="w-5 h-5 border-4 border-dashed rounded-full animate-spin border-neutral-100 mx-auto px-2 py-2"></div>
            : 'Recargar'
            }
          </button>
        </div>
        <div className="w-full h-60 overflow-y-scroll">
          {isLoading ? (
            <p className="text-center">Cargando...</p>
          ) : (
            logs
              ?.filter((v) => v.type === "schedules")
              .map((l) => (
                <div className="log-row flex items-stretch gap-4 px-5 sm:px-6 py-4">
                  <div className="w-0.75 rounded-full bg-purple-600 shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="mono text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded bg-purple-500 text-neutral-200">
                        [{l.type === "schedules" ? "LOGS HORARIOS" : "LOGS"}]
                      </span>
                    </div>
                    <p className="text-sm text-[#E7E9EE] leading-snug">
                      {l.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="mono text-[10px] text-[#545B6B] mt-0.5">
                      {timeAgo(l.created_at.toLocaleString())}
                    </p>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </>
  );
}
