import { useQuery } from "@tanstack/react-query";
import StatCard from "~/components/panel/StatCard";
import { tokenContext } from "~/context";
import {
  getNews,
  getRadioInfo,
  getStatsSchedules,
  getStatsUsers,
  getUsers,
} from "~/libs/radio.service";
import type { Route } from "../+types/home";
import { useLoaderData } from "react-router";
import { useSemanaActual } from "~/hooks/useSemanaActual";
import LogsSchedules from "~/components/schedules/LogsSchedules";

const nowPlayingQuery = {
  queryKey: ["now-playing"],
  queryFn: async () => {
    const result = await getRadioInfo();
    if (!result) throw new Error("No data");
    return result;
  },
  refetchInterval: 15_000, // revalida cada 10s — perfecto para radio
};

export async function loader({ context }: Route.LoaderArgs) {
  const token = context.get(tokenContext);
  return { token };
}

export default function Dashboard() {
  const { token } = useLoaderData<typeof loader>();
  const { semana } = useSemanaActual();
  const { data, isLoading } = useQuery({
    queryKey: ["news-data"],
    queryFn: () =>
      getNews({
        limit: "10",
        page: "1",
      }),
  });
  const {
    data: radioData,
    isLoading: isLoadingRadioInfo,
    error: radioInfoError,
  } = useQuery(nowPlayingQuery);
  const { data: dataUsers, isLoading: isLoadingDataUsers } = useQuery({
    queryKey: ["users-data"],
    queryFn: () => getStatsUsers(token),
  });
  const { data: statsSchedules } = useQuery({
    queryKey: ["statsSchedules"],
    queryFn: () =>
      getStatsSchedules(token, {
        anio: "",
        mes: "",
        semana: String(semana),
        user: "",
      }),
  });

  return (
    <div className="grid grid-cols-3 h-screen">
      <div className="flex gap-2 col-span-2 py-2 px-4 w-full">
        <StatCard
          description="Total de usuarios"
          value={dataUsers ? dataUsers.total : 0}
          style="green"
        />
        <StatCard
          description="Noticias"
          value={data ? data.total : 0}
          style="red"
        />
        <StatCard
          description="Hras registradas"
          value={statsSchedules ? statsSchedules.total_schedules : 0}
          style="neutral"
        />
        <StatCard
          description="Hras registradas esta semana"
          value={statsSchedules ? statsSchedules.total_week : 0}
          style="purple"
        />
      </div>
      <div className="flex justify-center col-start-3 w-full px-3 py-2">
        <div className="flex flex-col gap-2 bg-neutral-800 w-96 h-40 rounded-2xl justify-center p-2">
          <div className="flex bg-purple-700 rounded-4xl items-center px-3 py-2 gap-2">
            <span className="relative flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-red-500"></span>
            </span>
            <p className="font-bold">
              {isLoadingRadioInfo ? "Load.." : radioData?.djusername}
            </p>
          </div>
          <p className="bg-purple-700 rounded-4xl items-center px-3 py-2 font-bold">
            {isLoadingRadioInfo ? "Load.." : radioData?.ulistener} Oyentes
          </p>
          <p className="bg-purple-700 rounded-4xl items-center px-3 py-2 font-bold">
            {isLoadingRadioInfo ? "Load.." : radioData?.listeners} pico de
            oyentes
          </p>
        </div>
      </div>
      <LogsSchedules token={token!} />
    </div>
  );
}
