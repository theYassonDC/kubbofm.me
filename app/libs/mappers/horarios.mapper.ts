import type { ColorDJ, Horario } from "../interface/horarios";
import type { Datum as ScheduleData } from "../interface/Schedules.interface";

export const mapHorario = (item: ScheduleData): Horario => ({
    id: item.id,
    djNombre: item.schedule_title,
    dia: item.dia,
    hora: item.hora,
    color: item.style as ColorDJ,
    user_id: item.deejayId
})

export const mapHorarios = (items: ScheduleData[]): Horario[] => items.map(mapHorario)