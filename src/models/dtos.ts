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
    hiringDate?: string
}

export type PatchUser = Omit<IUser, "id" | "userGroup">