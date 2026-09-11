import { useQuery } from "@tanstack/react-query";
import { getTeam } from "~/libs/radio.service";

export default function Team() {
  const { data, isLoading } = useQuery({
    queryKey: ["data-team"],
    queryFn: async () => {
      const res = await getTeam();
      if (res) {
        return res;
      }
    },
  });
  function formatRole(role: string) {
    switch (role) {
      case "admin":
        return "Administrador web";
      case "supervisor":
        return "Supervisor radio";
      case "head":
        return "Head eventos";
      case "dj":
        return "Dj oficial";
      case "dj_auxiliar":
        return "Dj auxiliar";
      default:
        break;
    }
  }
  return (
    <div className="flex flex-col items-center justify-center gap-10 mt-5">
      <h1 className="md:text-4xl text-2xl text-center">¡Conoce al equipo de KubboFM!</h1>
      <div className="flex flex-col items-center justify-center w-full gap-3">
        {data && data.data ? (
          data.data.map((v) => (
            <div className="flex gap-1 bg-neutral-900 w-72 items-center border-2 border-neutral-700 rounded-lg">
              <div className="flex items-center justify-center h-32 w-32 overflow-visible">
                <img src={v.figure_url ?? ""} alt={v.username} />
              </div>
              <div className="flex flex-col">
                <p className="text-2xl font-bold">{v.username}</p>
                <p className="text-sm">{formatRole(v.role)}</p>
              </div>
            </div>
          ))
        ) : (
          <>
            <p>No existe un equipo por el momento</p>
          </>
        )}
      </div>
    </div>
  );
}
