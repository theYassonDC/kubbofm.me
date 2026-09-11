// src/types/horarios.ts

export type ColorDJ = "pink" | "purple" | "blue" | "amber" | "teal" | "indigo"

export interface Horario {
  id: string
  user_id: string
  djNombre: string
  dia:      number  // 0 = Lunes, 6 = Domingo
  hora:     number  // 0-23 en zona horaria de la radio
  color:    ColorDJ
}

export interface Franja {
  label:     string  // "12:00 A.M – 01:00 A.M"
  horaRadio: number  // 0-23, clave para buscar en el mapa
}

export interface Pais {
  nombre:  string
  zona:    string  // IANA timezone — "America/Bogota"
  bandera: string
}

export type MapaHorarios = Record<string, Horario>

// Para el modal de detalle — extiende Horario con el label ya calculado
export interface HorarioSeleccionado extends Horario {
  label: string
}