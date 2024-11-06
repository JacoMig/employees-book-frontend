import {
    CreateRandomUsersParams,
    IUser,
    PatchUser,
    UserListQueryParams,
    UserListResponseDto,
} from '@/models/dtos'

import ApiClient from './apiClient'

interface IHttpUserClient {
    register: (
        username: string,
        email: string,
        password: string
    ) => Promise<{ username: string; email: string }>
    login: (
        usernameOrEmail: string,
        password: string
    ) => Promise<{ token: string }>
    get: (id: string) => Promise<IUser>
    list: (queryParams?: UserListQueryParams) => Promise<UserListResponseDto>
    remove: (id: string) => Promise<object>
    patch: (id: string, params: PatchUser) => Promise<object>
    createRandomUsers: (params:CreateRandomUsersParams) => Promise<{ added: number }>
}

const API_URL = import.meta.env.VITE_API_URL

const httpUserClient = (): IHttpUserClient => {
    const login = async (usernameOrEmail: string, password: string) => {
        return await ApiClient<{ token: string }>(
            `${API_URL}login`,
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({
                    usernameOrEmail,
                    password,
                }),
            },
            false
        )
    }

    const register = async (
        username: string,
        email: string,
        password: string
    ) => {
        return await ApiClient<{ username: string; email: string }>(
            `${API_URL}register`,
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            },
            false
        )
    }

    const get = async (id: string | undefined): Promise<IUser> => {
        return await ApiClient<IUser>(`${API_URL}user/${id}`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'GET',
        })
    }

    const list = async (
        queryParams?: UserListQueryParams
    ): Promise<UserListResponseDto> => {
        const params = queryParams
            ? `?companyId=${queryParams.companyId}&limit=${
                  queryParams.limit
              }&offset=${queryParams.offset}${
                  queryParams.username
                      ? `&username=${queryParams.username}`
                      : ''
              }`
            : ''
        return await ApiClient<UserListResponseDto>(`${API_URL}user${params}`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'GET',
        })
    }

    const remove = async (id: string): Promise<object> => {
        return await ApiClient<object>(`${API_URL}user/${id}`, {
            method: 'DELETE',
        })
    }

    const patch = async (id: string, params: PatchUser): Promise<object> => {
        return await ApiClient<object>(`${API_URL}user/${id}`, {
            method: 'PATCH',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        })
    }

    const createRandomUsers = async (
        params: CreateRandomUsersParams
    ): Promise<{ added: number }> => {
        return await ApiClient<{ added: number }>(
            `${API_URL}rpc/users/createRandomUsers`,
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({
                    count: params.num,
                    companyId: params.companyId,
                    companyName: params.companyName,
                }),
            }
        )
    }

    return { register, get, login, list, remove, patch, createRandomUsers }
}

export default httpUserClient
