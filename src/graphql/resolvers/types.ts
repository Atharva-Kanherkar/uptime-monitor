export interface UserInput {
    email: string;
    name?: string;
    password: string;
}

export interface User {
    id: string;
    email: string;
    name?: string;
    password: string;
}

export interface AuthPayload {
    token: string;
    user: User;
}
