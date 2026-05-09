export interface AuthResponse {
    token: string;
    email: string;
    expiration: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface User {
    id: string;
    email: string;
    token: string;
    fullName: string;
}