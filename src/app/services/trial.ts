import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ClinicalTrial } from '../models/clinical-trial';
import { environment } from '../../environments/environment.development';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { parseHttpError } from '../utils/error-parser';
import { PagedResult } from '../models/pagedResult';

@Injectable({ providedIn: 'root'})
export class TrialService {
  // Inyectamos HttpClient para realizar solicitudes HTTP
  private http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/clinicaltrials`;

  // Estados internos con signals para manejar los datos y el estado de carga.
  private _trials = signal<ClinicalTrial[]>([])
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);
  private _currentPage = signal<number>(1);
  private _totalPages = signal<number>(1);
  private _totalCount = signal<number>(0);

  // Exponemos los signals como readonly para que los componentes puedan suscribirse a ellos.
  trials = this._trials.asReadonly();
  loading = this._loading.asReadonly()
  error = this._error.asReadonly();
  currentPage = this._currentPage.asReadonly();
  totalPages = this._totalPages.asReadonly();
  totalCount = this._totalCount.asReadonly();
  
  // Computed: cantidad total
  trialCount = computed(() => this._trials().length);

  loadTrials(filters?: { phase?: string; status?: string; page?: number; pageSize?: number }): void {
    let params = new HttpParams();
    if (filters?.phase) params = params.set('phase', filters.phase);
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.page) params = params.set('page', filters.page.toString());
    if (filters?.pageSize) params = params.set('pageSize', filters.pageSize.toString());

    this.http.get<PagedResult<ClinicalTrial>>(this.apiUrl, { params }).pipe(
      tap(data => {
        this._trials.set(data.items);
        this._totalPages.set(data.totalPages || 1);
        this._currentPage.set(data.page || 1);
        this._totalCount.set(data.totalCount);
        this._loading.set(false);
      }),
      catchError((err) => {
        this._loading.set(false);
        const message = parseHttpError(err);
        this._error.set(message);
        return throwError(() => new Error(message));
      })
    ).subscribe();
  }

  getTrialById(id: number): Observable<ClinicalTrial> {    
    this._loading.set(true);
    this._error.set(null);

    return this.http.get<ClinicalTrial>(`${this.apiUrl}/${id}`);
  }

  createTrial(trial: Omit<ClinicalTrial, 'id'>): Observable<ClinicalTrial> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.post<ClinicalTrial>(this.apiUrl, trial).pipe(
      tap((newTrial) => {
        this._loading.set(false);
        // Agregar el nuevo trial a la lista actual
        this._trials.update(current => [...current, newTrial]);
      }),
      catchError((err) => {
        this._loading.set(false);
        const message = parseHttpError(err);
        this._error.set(message);
        return throwError(() => new Error(message));
      })
    );
  }

  updateTrial(id: number, trial: ClinicalTrial): Observable<ClinicalTrial> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.put<ClinicalTrial>(`${this.apiUrl}/${id}`, trial).pipe(
      tap((updatedTrial) => {
        this._loading.set(false);
        // Actualizar el trial en la lista actual
        this._trials.update(current => current.map(t => t.id === id ? updatedTrial : t));
      }),
      catchError((err) => {
        this._loading.set(false);
        const message = parseHttpError(err);
        this._error.set(message);
        return throwError(() => new Error(message));
      })
    );
  }
  
  deleteTrial(id: number): Observable<ClinicalTrial> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.delete<ClinicalTrial>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this._loading.set(false);
        // Eliminar el trial de la lista actual
        this._trials.update(current => current.filter(t => t.id !== id));
      }),
      catchError((err) => {
        this._loading.set(false);
        const message = parseHttpError(err);
        this._error.set(message);
        return throwError(() => new Error(message));
      })
    );
  }
}
