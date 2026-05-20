import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { TrialList } from './trial-list/trial-list';
import { TrialForm } from './trial-form/trial-form';
import { TrialDetail } from './trial-detail/trial-detail';
import { Register } from './auth/register/register';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
    { 
        path : 'login', 
        component: Login, 
        canActivate: [guestGuard] // Si ya están logueados, no pueden volver al login
    },
    { 
        path : 'register', 
        component: Register,
        canActivate: [guestGuard] // Si ya están logueados, no pueden volver al register
    },
    {
        path : 'trials',
        canActivate: [authGuard], // Protegemos las rutas de trials con el guard de autenticación
        children: [
            { path : '', component: TrialList },
            { path : 'new', component: TrialForm },
            { path : ':id/edit', component: TrialForm },
            { path : ':id', component: TrialDetail }
        ]
    },
    { path : '**', redirectTo: 'trials', pathMatch: 'full' } // Si entran a algo raro, los redirigimos a la lista de trials
];
