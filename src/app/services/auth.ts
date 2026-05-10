import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/auth';
import { environment } from '../../environments/environment.development';
import { catchError, Observable, tap, throwError } from 'rxjs';

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

    login(credentials: LoginRequest): Observable<AuthResponse> {
        this._loading.set(true);
        this._error.set(null);

        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
            tap((response) => {
                this._user.set({
                    id: response.userId,
                    email: response.email,
                    token: response.token,
                    userName: response.userName
                });
                this._loading.set(false);
            }),
            catchError((err: HttpErrorResponse) => {
                this._loading.set(false);
                const message = this.parseError(err);
                this._error.set(message);
                return throwError(() => new Error(message));
            })
        );
    }

    register(userData: RegisterRequest) {
        this._loading.set(true);
        this._error.set(null);

        return this.http.post(`${this.apiUrl}/register`, userData).pipe(
            tap(() => {} ),
            catchError((err: HttpErrorResponse) => {
                this._loading.set(false);
                const message = this.parseError(err);
                this._error.set(message);
                return throwError(() => new Error(message));
            })
        );
    };

    logout() {
        this._loading.set(true);
        this._error.set(null);
        this._user.set(null);
        this._loading.set(false);
    };

    private parseError(err: HttpErrorResponse): string {
        if (err.status === 400 && err.error?.errors) {
            // Extraemos todos los mensajes de error en un solo array plano
            const validationErrors = err.error.errors;
            const messages = [];

            for (const key in validationErrors) {
            if (validationErrors.hasOwnProperty(key)) {
                messages.push(...validationErrors[key]);
            }
            }
            // Devolvemos los errores unidos por un salto de línea o solo el primero
            return messages.join(' '); 
        }

        return err.error?.detail || err.message || 'Error inesperado';
    }
}