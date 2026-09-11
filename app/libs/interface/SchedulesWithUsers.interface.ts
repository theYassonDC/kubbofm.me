export interface SchedulesWithUsersResponse {
    current_page:     number;
    current_page_url: string;
    data:             Datum[];
    first_page_url:   string;
    from:             number;
    next_page_url:    null;
    path:             string;
    per_page:         number;
    prev_page_url:    null;
    to:               number;
}

export interface Datum {
    username:    string;
    total_hours: number;
}
