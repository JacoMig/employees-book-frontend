import { IUser, PatchUser } from "@/models/dtos";

import ApiClient from "./apiClient";

interface IHttpUserClient {
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<{ username: string; email: string }>;
  login: (
    usernameOrEmail: string,
    password: string
  ) => Promise<{ token: string }>;
  get: (id: string) => Promise<IUser | undefined>;
  list: () => Promise<IUser[]>;
  remove: (id: string) => Promise<object>;
  patch: (id: string, params:PatchUser) => Promise<object>;
}

const API_URL = import.meta.env.VITE_API_URL

const httpUserClient = (): IHttpUserClient => {
  const login = async (usernameOrEmail: string, password: string) => {
    return await ApiClient<{ token: string }>(
      `${API_URL}login`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          usernameOrEmail,
          password,
        }),
      },
      false
    );
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    return await ApiClient<{ username: string; email: string }>(
      `${API_URL}register`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      },
      false
    );
  };

  const get = async (id: string): Promise<IUser> => {
    return await ApiClient<IUser>(`${API_URL}user/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "GET",
    });
  };

  const list = async (): Promise<IUser[]> => {
    return await ApiClient<IUser[]>(`${API_URL}user`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "GET",
    });
  };

  const remove = async (id: string): Promise<object> => {
    return await ApiClient<object>(`${API_URL}user/${id}`, {
      method: "DELETE",
    });
  };

  const patch = async (id:string, params:PatchUser):Promise<object> => {
    return await ApiClient<object>(`${API_URL}user/${id}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params)
    });
  }
  

  return { register, get, login, list, remove, patch };
};

export default httpUserClient;
