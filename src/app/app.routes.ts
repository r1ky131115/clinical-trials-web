import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { TrialList } from './trial-list/trial-list';
import { TrialForm } from './trial-form/trial-form';
import { TrialDetail } from './trial-detail/trial-detail';

export const routes: Routes = [
    { path : '', redirectTo: '/trials', pathMatch: 'full' },
    { path : 'login', component: Login },
    { path : 'trials', component: TrialList },
    { path : 'trials/new', component: TrialForm },
    { path : 'trials/:id', component: TrialDetail },
    { path : '**', redirectTo: '/trials' } // Si entran a algo raro, los redirigimos a la lista de trials
];
