export interface CategoriesResponse {
    current_page:   number;
    data:           Category[];
    first_page_url: string;
    from:           number;
    last_page:      number;
    last_page_url:  string;
    links:          Link[];
    next_page_url:  null;
    path:           string;
    per_page:       number;
    prev_page_url:  null;
    to:             number;
    total:          number;
}

export interface Category {
    id:          string;
    created_at:  Date;
    updated_at:  Date;
    deleted_at:  null;
    name:        string;
    description: string;
}

export interface Link {
    url:    null | string;
    label:  string;
    page:   number | null;
    active: boolean;
}
