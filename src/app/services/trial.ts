import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ClinicalTrial } from '../models/clinical-trial';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})

export class TrialService {
  // Inyectamos HttpClient para realizar solicitudes HTTP
  private http = inject(HttpClient);

  // URL base de la API.
  private readonly apiUrl = `${environment.apiUrl}/clinicaltrials`;

  // Estados internos con signals para manejar los datos y el estado de carga.
  private _trials = signal<ClinicalTrial[]>([])
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // Exponemos los signals como readonly para que los componentes puedan suscribirse a ellos.
  trials = this._trials.asReadonly();
  loading = this._loading.asReadonly()
  error = this._error.asReadonly();

  // Computed: cantidad total
  trialCount = computed(() => this._trials().length);

  // Método para cargar los trials desde la API.
  loadTrials(): void {
    this._loading.set(true);
    this._error.set(null);

    this.http.get<ClinicalTrial[]>(this.apiUrl).subscribe({
      next: (data) => {
        this._trials.set(data);
        this._loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar los trials:', err);
        this._error.set(this.getErrorMessage(err));
        this._loading.set(false);
      },
    });
  }

  // Método para obtener un trial por ID.
  getTrialById(id: number) {
    return this.http.get<ClinicalTrial>(`${this.apiUrl}/${id}`)
  }

  // Helper para parsear errores HTTP de forma amigable
  private getErrorMessage(err: any): string {
    if (err.status === 0) {
      return 'No se pudo conectar al servidor. Verifica tu conexión.';
    } else if (err.status >= 400 && err.status < 500) {
      return 'Error en la solicitud. Por favor, verifica los datos ingresados.';
    } else if (err.status >= 500) {
      return 'Error del servidor. Intenta nuevamente más tarde.';
    } else {
          return err.error?.title || err.message || 'Error desconocido.';
    }
  };
}
