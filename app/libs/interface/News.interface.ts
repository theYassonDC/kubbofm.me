export interface NewsResponse {
    current_page:   number;
    data:           NewsData[];
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

export interface NewsData {
    id:          string;
    created_at:  Date;
    updated_at:  Date;
    deleted_at:  null;
    title:       string;
    content:     string;
    author_id:   string;
    category_id: string;
    image_url:   string;
    author:      Author;
    category:    Category;
}

export interface Author {
    id:       string;
    username: string;
}

export interface Category {
    id:   string;
    name: string;
}

export interface Link {
    url:    null | string;
    label:  string;
    page:   number | null;
    active: boolean;
}
