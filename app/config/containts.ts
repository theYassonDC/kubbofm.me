export const BASE_URL = import.meta.env.VITE_BASE_URL;
export const AUDIO_STREAM = import.meta.env.VITE_AUDIO_STREAM;
export const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
export const defaultkekoimg = import.meta.env.VITE_defaultkekoimg;
export const MAINTENANCE = import.meta.env.VITE_MAINTENANCE;
export const DEBUG = import.meta.env.VITE_DEBUG;
export const WEBHOOKS = {
  SCHEDULES_LOGS: import.meta.env.VITE_WEBHOOK_SCHEDULES,
  REQUESTS_LOGS: import.meta.env.VITE_WEBHOOK_REQUESTS,
}
export const schedule_config = {
  ZONA_RADIO: "America/Bogota",
  discord: { rolDjId: '1541821575706181643' },
  COLORES: {
    pink: { bg: "#FBAED2", text: "#831843", border: "#F472B6" },
    purple: { bg: "#C084FC", text: "#3B0764", border: "#A855F7" },
    blue: { bg: "#93C5FD", text: "#1E3A8A", border: "#3B82F6" },
    amber: { bg: "#FCD34D", text: "#78350F", border: "#F59E0B" },
    teal: { bg: "#5EEAD4", text: "#134E4A", border: "#14B8A6" },
    indigo: { bg: "#818CF8", text: "#1E1B4B", border: "#6366F1" },
  },
  PAISES: [
    { nombre: "Colombia / Perú", zona: "America/Bogota", bandera: "🇨🇴" },
    { nombre: "Venezuela", zona: "America/Caracas", bandera: "🇻🇪" },
    { nombre: "Ecuador", zona: "America/Guayaquil", bandera: "🇪🇨" },
    {
      nombre: "Argentina",
      zona: "America/Argentina/Buenos_Aires",
      bandera: "🇦🇷",
    },
    { nombre: "Chile", zona: "America/Santiago", bandera: "🇨🇱" },
    { nombre: "Brasil", zona: "America/Sao_Paulo", bandera: "🇧🇷" },
    { nombre: "México", zona: "America/Mexico_City", bandera: "🇲🇽" },
    { nombre: "España", zona: "Europe/Madrid", bandera: "🇪🇸" },
    { nombre: "EE.UU. (Este)", zona: "America/New_York", bandera: "🇺🇸" },
  ],
  DAYS: [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ],
};
