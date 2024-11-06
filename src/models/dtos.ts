export interface IUser {
    id: string,
    username: string,
    email: string,
    userGroup: string,
    companyId: string,
    companyName: string,
    firstName?:string,
    lastName?:string,
    jobTitle?: string,
    department?: string,
    tags?: string[],
    cvUrl?: string,
    profileImage?: string,
    hiringDate?: string,
    
}

export type PatchUser = Omit<IUser, "id" | "userGroup" | "profileImage"> & {
    profileImage?: Blob
}


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
    companyId: string,
    username?: string
    offset: number,
    limit: number,
}

export type CreateRandomUsersParams = {
    num:number,
    companyId: string,
    companyName: string
}