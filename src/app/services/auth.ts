import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthResponse, LoginRequest, User } from '../models/auth';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);

    private readonly apiUrl = `${environment.apiUrl}/auth`;

    private _user = signal<User | null>(null);
    private _loading = signal<boolean>(false);
    private _error = signal<string | null>(null);

    user = this._user.asReadonly();
    loading = this._loading.asReadonly()
    error = this._error.asReadonly();

    isAuthenticated = computed(() => !!this._user());

    login(credentials: LoginRequest) {
        this._loading.set(true);
        this._error.set(null);

        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).subscribe({
            next: (response) => {
                this._loading.set(false);
                this._user.set({ 
                    id: "1",
                    email: response.email,
                    token: response.token,
                    fullName: response.email.split('@')[0]
                });
            },
            error: (err) => {
                console.error('Error al intentar iniciar sesión:', err);
                this._error.set('Credenciales inválidas');
                this._loading.set(false);
            }
        });
    }

    register(userDate: Omit<User, 'id'>) {
        this._loading.set(true);
        this._error.set(null);

        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userDate).subscribe({
            next: (response) => {
                this._loading.set(false);
                this._user.set({ 
                    id: "1",
                    email: response.email,
                    token: response.token,
                    fullName: response.email.split('@')[0]
                });
            },
            error: (err) => {
                console.error('Error al intentar registrarse:', err);
                this._error.set('Error al registrarse');
                this._loading.set(false);
            }
        });
    }
}