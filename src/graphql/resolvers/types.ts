export interface UserInput {
    website: WebsiteInput;
    userName: any;
    email: string;
    name?: string;
    password: string;
}
export interface UpdateUserInput {
    website: any;
    userName: any;
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
export interface Website {
    id: number;
    url: string;
    status: string;
    responseTime: number;
    timestamp: string;
    user: User;
  }
export interface WebsiteInput{
    url: string;
    status: string;
    responseTime: number;
}