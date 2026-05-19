// src/app/utils/error-parser.ts
import { HttpErrorResponse } from '@angular/common/http';

export function parseHttpError(err: HttpErrorResponse): string {
  const errorBody = err.error;

  if (err.status === 0) {
    return 'No se pudo conectar al servidor. Verifica tu conexión.';
  }

  // 1. Caso RFC 7807: Errores de validación (400 Bad Request)
  if (err.status === 400 && errorBody?.errors) {
    return Object.values(errorBody.errors).flat().join(' ');
  }

  // 2. Caso RFC 7807: Errores generales con 'detail' (401, 403, 404, 500)
  if (errorBody?.detail) {
    return errorBody.detail;
  }

  // 3. Fallbacks
  if (typeof errorBody === 'string' && errorBody.length > 0) {
    return errorBody;
  }

  return `Error ${err.status}: ${err.statusText || 'Intente más tarde'}`;
}
