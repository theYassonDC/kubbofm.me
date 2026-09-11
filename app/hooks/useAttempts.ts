import { useCallback, useEffect } from "react";
import useLocalStorage from "./useLocalStorage";

const THIRTY_MINUTES = 5 * 60 * 1000; // en milisegundos

interface AttemptsData {
  count: number;
  timestamp: number;
}

function useAttempts(key: string = "attempts", limitMs: number = THIRTY_MINUTES) {
  const { value, setValue, removeValue } = useLocalStorage<AttemptsData>(key, {
    count: 0,
    timestamp: Date.now(),
  });

  // Chequea si ya expiró el tiempo
  const haExpirado = useCallback(
    (data: AttemptsData) => Date.now() - data.timestamp > limitMs,
    [limitMs]
  );

  // Reiniciar manualmente
  const reset = useCallback(() => {
    setValue({ count: 0, timestamp: Date.now() });
  }, [setValue]);

  // Incrementar intento (chequea expiración antes de sumar)
  const increment = useCallback(() => {
    setValue((prev) => {
      if (haExpirado(prev)) {
        return { count: 1, timestamp: Date.now() };
      }
      return { count: prev.count + 1, timestamp: Date.now() };
    });
  }, [setValue, haExpirado]);

  // Chequeo automático al montar (por si pasó el tiempo con la tab cerrada)
  useEffect(() => {
    if (haExpirado(value)) {
      reset();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const msRestantes = Math.max(0, limitMs - (Date.now() - value.timestamp));

  return {
    attempts: value.count,
    increment,
    reset,
    removeValue, // por si querés borrar la key completa del localStorage
    msRestantes,
  } as const;
}

export default useAttempts;