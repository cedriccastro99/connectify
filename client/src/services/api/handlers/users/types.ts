export type TNewUser = {
    _id?: string;
    email: string;
    role: string;
    password?: string;
    status?: string;
}

export type TLoginUser = {
    email: string;
    password: string;
}