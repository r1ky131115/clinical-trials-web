// src/app/guards/guest.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const guestGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        // Si ya está logueado, lo mandamos a la ruta principal
        return router.createUrlTree(['/trials']);
    }

    // Si no está logueado, puede ver el login/register
    return true;
};