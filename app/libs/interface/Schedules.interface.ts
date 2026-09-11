export interface SchedulesResponse {
    id:             string;
    created_at:     Date;
    updated_at:     Date;
    deleted_at:     null;
    deejayId:       string;
    schedule_title: string;
    dia:            number;
    hora:           number;
    style:          string;
}
export interface StatsScheduleResponse {
    total_schedules: number,
    total_week: number,
    total_user: number
}