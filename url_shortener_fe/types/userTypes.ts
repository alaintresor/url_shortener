export interface User {
    id: string;
    username: string;
    email: string;
}

export interface CreateUserPayload {
    username: string;
    email: string;
    password: string;
  }

export interface LoginUserPayload {
    email: string;
    password: string;
    rememberMe?: boolean;
  }

