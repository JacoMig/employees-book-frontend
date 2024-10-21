export interface IUser {
    id: string,
    username: string,
    email: string,
    userGroup: string,
    firstName?:string,
    lastName?:string,
    jobTitle?: string,
    department?: string,
    tags?: string[],
    cvUrl?: string,
    profileImage?: string,
    hiringDate?: string
}

export type PatchUser = Omit<IUser, "id" | "userGroup">


export interface IPagination {
    pages: number,
    offset: number,
    currentPage: number,
    limit: number
}

export type UserListResponseDto = {
    users: IUser[],
    pagination: IPagination
}

export type UserListQueryParams = {
    offset: number,
    limit: number
}