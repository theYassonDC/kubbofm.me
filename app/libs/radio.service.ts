import { BASE_API_URL, BASE_URL } from "~/config/containts";
import type { CategoriesResponse, Category } from "./interface/Categories.interface";
import type {
  NewsData as NewResponse,
  NewsData,
  NewsResponse,
} from "./interface/News.interface";
import type {
  SchedulesResponse,
  StatsScheduleResponse,
} from "./interface/Schedules.interface";
import type { UsersResponse } from "./interface/Users.interface";
import type { PanelLogsResponse } from "./interface/Logs.interface";
import type { SchedulesWithUsersResponse } from "./interface/SchedulesWithUsers.interface";

export interface RadiosBlum {
  history: string[];
  title: string;
  art: string;
  ulistener: string;
  listeners: string;
  bitrate: string;
  djusername: string;
  djprofile: string;
}
export async function getRadioInfo(): Promise<RadiosBlum> {
  const res = await fetch(BASE_URL, { method: "GET" });
  const data = (await res.json()) as RadiosBlum;
  return data;
}

/***
 * --------------------------------- NOTICIAS ---------------------------------
 */
interface NewsProps {
  page: string;
  limit: string;
  category?: string;
}
export async function getNews(param: NewsProps): Promise<NewsResponse> {
  const params = new URLSearchParams({
    page: param.page,
    limit: param.limit,
  });
  if (param.category) {
    params.set("category", param.category);
  }
  const res = await fetch(`${BASE_API_URL}/api/public/news?${params}`, {
    method: "GET",
  });
  const data = (await res.json()) as NewsResponse;
  return data;
}
export interface NewDto {
  title: string;
  content: string;
  category_id: string;
  image_url: string;
}

export async function createNew(token: string, body: NewDto): Promise<NewResponse> {
  const res = await fetch(`${BASE_API_URL}/api/news`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  })

  const data = await res.json() as NewResponse
  return data;
}

export async function deleteNew(id: string, token: string): Promise<NewsData> {
  const res = await fetch(`${BASE_API_URL}/api/news/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  const data = (await res.json()) as NewsData;
  return data;
}
export async function updateNew(id: string, body: Partial<NewDto>, token: string): Promise<NewsData> {
  const res = await fetch(`${BASE_API_URL}/api/news/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as NewsData;
  return data;
}
/***
 * --------------------------------- CATEGORIAS ---------------------------------
 */
export async function getCategories(
  param: Omit<NewsProps, "category">,
): Promise<CategoriesResponse> {
  const params = new URLSearchParams({
    page: param.page,
    limit: param.limit,
  });
  const res = await fetch(
    `${BASE_API_URL}/api/public/categories_news?${params}`,
    { method: "GET" },
  );
  const data = (await res.json()) as CategoriesResponse;
  return data;
}
export async function getCategory(token: string, id: string): Promise<Category> {
  const res = await fetch(`${BASE_API_URL}/api/categories_news/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })

  const data = await res.json() as Category

  return data
}

export interface CategoryDto {
  name: string,
  description: string
}
export async function createCategory(body: CategoryDto, token: string): Promise<Category> {
  const res = await fetch(`${BASE_API_URL}/api/categories_news`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  })

  const data = await res.json() as Category

  return data
}
export async function updateCategory(id: string, body: Partial<CategoryDto>, token: string): Promise<Category> {
  const res = await fetch(`${BASE_API_URL}/api/categories_news/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  })

  const data = await res.json() as Category

  return data
}
export async function deleteCategory(id: string, token: string): Promise<Response> {
  const res = await fetch(`${BASE_API_URL}/api/categories_news/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })

  const data = await res.json()

  return data
}

export async function getNewById(id: string): Promise<NewResponse> {
  const res = await fetch(`${BASE_API_URL}/api/public/news/${id}`, {
    method: "GET",
  });
  const data = (await res.json()) as NewResponse;
  return data;
}

/***
 * --------------------------------- HORARIOS ---------------------------------
 */
interface SchedulesProps {
  semana: number;
  anio: number;
}
export async function getSchedules({
  semana,
  anio,
}: SchedulesProps): Promise<SchedulesResponse[]> {
  const res = await fetch(
    `${BASE_API_URL}/api/public/schedules?semana=${semana}&anio=${anio}`,
    {
      method: "GET",
      cache: "no-store"
    },
  );
  const data = (await res.json()) as SchedulesResponse[];
  return data;
}
export interface RegistrarDTO {
  dia: number;
  hora: number;
  style: string;
  semana: number;
  anio: number;
}
export async function createSchedule(
  body: RegistrarDTO,
  token: string,
): Promise<SchedulesResponse> {
  const res = await fetch(`${BASE_API_URL}/api/schedules`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as SchedulesResponse;
  return data;
}

export async function deleteSchedule(id: string, token: string) {
  const res = await fetch(`${BASE_API_URL}/api/schedules/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  const data = (await res.json()) as SchedulesResponse;
  return data;
}

export async function getUsers(
  token: string | null,
  param: Omit<NewsProps, "category">,
): Promise<UsersResponse> {
  const params = new URLSearchParams({
    page: param.page,
    limit: param.limit,
  });
  const res = await fetch(`${BASE_API_URL}/api/users?${params}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  const data = (await res.json());
  return data;
}

export async function getStatsUsers(token: string | null) {
  const res = await fetch(`${BASE_API_URL}/api/user/stats`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  const data = (await res.json());
  return data;
}

interface ParamStatsSchedules {
  semana: string;
  user: string;
  mes: string;
  anio: string;
}
export async function getStatsSchedules(token: string|null, param: ParamStatsSchedules): Promise<StatsScheduleResponse> {
  const params = new URLSearchParams({
    semana: param.semana,
    user: param.user,
    mes: param.mes,
    anio: param.anio
  });
  const res = await fetch(`${BASE_API_URL}/api/schedule/stats?${params}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  const data = (await res.json()) as StatsScheduleResponse;
  return data;
}

export async function getTeam(): Promise<UsersResponse> {
  const res = await fetch(`${BASE_API_URL}/api/public/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  const data = (await res.json()) as UsersResponse;
  return data;
}

export async function getLogs(token: string): Promise<PanelLogsResponse[]> {
  const res = await fetch(`${BASE_API_URL}/api/logs`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  const data = (await res.json()) as PanelLogsResponse[];
  return data;
}
interface ParamSchedesWithUsers extends Omit<ParamStatsSchedules, 'user'> {
  page: string
}
export async function getSchedulesWithUsers(token: string, param: ParamSchedesWithUsers): Promise<SchedulesWithUsersResponse> {
  const params = new URLSearchParams({
    page: param.page,
    semana: param.semana,
    mes: param.mes,
    anio: param.anio,
  });
  const res = await fetch(`${BASE_API_URL}/api/user/schedules/list?${params}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  const data = (await res.json()) as SchedulesWithUsersResponse;
  return data;
}

