import { BASE_API_URL } from "~/config/containts";
import type { AuthLoginResponse } from "./interface/Auth.interface";
import type { UsersData } from "./interface/Users.interface";

export interface AuthProps {
  username: string;
  password: string;
}
export async function auth(body: AuthProps): Promise<AuthLoginResponse> {
  const res = await fetch(`${BASE_API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as AuthLoginResponse
  return data;
}

export async function authMe(token: string): Promise<Response> {
  const res = await fetch(`${BASE_API_URL}/api/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
  });
  return res;
}

export async function createUser(token: string, body: UserDto): Promise<Response> {
  const res = await fetch(`${BASE_API_URL}/api/users`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  })
  return res;
}

export async function getUserById(id: string, token: string): Promise<UsersData> {
  const res = await fetch(`${BASE_API_URL}/api/users/${id}`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
  })
  const data = (await res.json()) as UsersData
  return data;
}

export async function updateUser(token: string, id: string, body: Partial<UserDto>) {
  const res = await fetch(`${BASE_API_URL}/api/users/${id}`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  })
  return res;
}

export async function deleteUser(token: string, id: string): Promise<Response> {
  const res = await fetch(`${BASE_API_URL}/api/users/${id}`, {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
  })
  return res;
}

export async function registerUser(body: UserRegisterDto): Promise<Response> {
  const res = await fetch(`${BASE_API_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body)
  })

  if (!res.ok) {
    console.log(BASE_API_URL)
    const errorBody = await res.json();
    throw errorBody;
  }

  return res;
}