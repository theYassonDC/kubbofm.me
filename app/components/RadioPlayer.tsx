import { useAudioStream } from "~/hooks/useAudioStream";
import VolumeSlider from "./VolumenSlider";
import { useState } from "react";
import MarqueeText from "./MarqueeText";
import { getRadioInfo } from "~/libs/radio.service";
import { queryClient } from "~/libs/queyClient";
import { useQuery } from "@tanstack/react-query";
import { getKekoImg } from "~/libs/hobbazimager.";
import { AUDIO_STREAM, defaultkekoimg } from "~/config/containts";

const nowPlayingQuery = {
  queryKey: ["now-playing"],
  queryFn: async () => {
    const result = await getRadioInfo();
    if (!result) throw new Error("No data");
    return result;
  },
  refetchInterval: 10_000, // revalida cada 10s — perfecto para radio
};
export async function clientLoader() {
  await queryClient.ensureQueryData(nowPlayingQuery);
  return null;
}

export default function RadioPlayer() {
  const { isPlaying, isLoading, error, toggle, setVolume } = useAudioStream(
    AUDIO_STREAM,
  );
  const { data, isLoading: isLoadingInfo, error: radioInfoError } = useQuery(nowPlayingQuery);
  const { data: kekoData } = useQuery({
    queryKey: ["keko_dj", data?.djusername],
    queryFn: () =>
      getKekoImg({
        action: "wave",
        size: "n",
        user: `${data!.djusername}`,
      }),
    enabled: !!data?.djusername,
    staleTime: Infinity,
  });
  const [volume, setVolumeState] = useState(1);
  const handleVolume = (val: number) => {
    setVolumeState(val);
    setVolume(val);
  };
  return (
    <div className="md:flex gap-2 px-4 items-center justify-center">
      <div className="h-20 w-20 overflow-visible md:m-0 m-auto">
        <img src={defaultkekoimg} alt="kekoimg" />
      </div>
      <button
        className="p-4 w-14 h-14 bg-purple-600 rounded-full cursor-pointer hover:bg-purple-700 active:bg-purple-600"
        onClick={toggle}
        disabled={isLoading}
      >
        {isLoading ? (
          <p className="animate-spin">⏳</p>
        ) : isPlaying ? (
          <img src="/assets/pause.svg" alt="play" height={30} width={30} />
        ) : (
          <img src="/assets/play.svg" alt="play" />
        )}
      </button>
      <div className="flex flex-col">
        <p className="text-white font-semibold flex gap-2">
          {isLoadingInfo ? "Cargando.." : data ? data?.djusername : 'Not found' }
          <p className="flex items-center">
            <img src="/assets/air.svg" alt="air" width={18} />
            {isLoadingInfo ? "Cargando.." : data ? data?.listeners : 'NaN' }
          </p>
        </p>
        <MarqueeText
          text={isLoadingInfo ? "Cargando.." : data ? data!.title : 'none' }
          className="w-24"
        />
      </div>
      <div className="flex flex-4 justify-end items-center gap-2">
        {isPlaying ? (
          <>
            <span className="relative flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-red-500"></span>
            </span>
            <p className="text-red-500">En vivo</p>
          </>
        ) : (
          <>
            <span className="relative flex size-3">
              <span className="relative inline-flex size-3 rounded-full bg-neutral-500"></span>
            </span>
            <p className="text-neutral-500">En vivo</p>
          </>
        )}
        <VolumeSlider volume={volume} onChange={handleVolume} />
      </div>
    </div>
  );
}
