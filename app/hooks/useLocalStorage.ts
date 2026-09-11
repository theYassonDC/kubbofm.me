import { useState, useCallback, useEffect } from "react";

function useLocalStorage<T>(key: string, initialValue: T) {
  // Lee el valor inicial desde localStorage (o usa el default)
  const readValue = useCallback((): T => {
    if (typeof window === "undefined") return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error leyendo localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Guardar / actualizar
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));

        // dispara evento manual para sincronizar en la misma pestaña
        window.dispatchEvent(new Event("local-storage"));
      } catch (error) {
        console.warn(`Error guardando localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Borrar
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
      window.dispatchEvent(new Event("local-storage"));
    } catch (error) {
      console.warn(`Error borrando localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Sincroniza si cambia en otra pestaña o se dispara el evento manual
  useEffect(() => {
    const handleChange = () => setStoredValue(readValue());

    window.addEventListener("storage", handleChange); // otras pestañas
    window.addEventListener("local-storage", handleChange); // misma pestaña

    return () => {
      window.removeEventListener("storage", handleChange);
      window.removeEventListener("local-storage", handleChange);
    };
  }, [readValue]);

  return { value: storedValue, setValue, removeValue } as const;
}

export default useLocalStorage;