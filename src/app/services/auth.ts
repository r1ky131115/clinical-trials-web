import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/auth';
import { environment } from '../../environments/environment.development';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { parseHttpError } from '../utils/error-parser';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);

    private readonly apiUrl = `${environment.apiUrl}/auth`;

    private _user = signal<User | null>(this.getUserFromStorage());
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
                localStorage.setItem('trial_auth_user', JSON.stringify(this._user()));
                this._loading.set(false);
            }),
            catchError((err: HttpErrorResponse) => {
                this._loading.set(false);
                const message = parseHttpError(err);
                this._error.set(message);
                return throwError(() => new Error(message));
            })
        );
    }

    register(userData: RegisterRequest): Observable<void> {
        this._loading.set(true);
        this._error.set(null);

        return this.http.post<void>(`${this.apiUrl}/register`, userData).pipe(
            tap(() => {
                this._loading.set(false);
            }),
            catchError((err: HttpErrorResponse) => {
                this._loading.set(false);
                const message = parseHttpError(err);
                this._error.set(message);
                return throwError(() => new Error(message));
            })
        );
    };

    logout() {
        this._user.set(null);
        localStorage.removeItem('trial_auth_user');
        this.router.navigate(['/login']);
    }

    // Método helper para obtener el token rápidamente
    getToken(): string | null {
        return this._user()?.token || null;
    }

    private getUserFromStorage(): User | null {
        const storedUser = localStorage.getItem('trial_auth_user');
        return storedUser ? JSON.parse(storedUser) : null;
    }
}