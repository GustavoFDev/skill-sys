import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthenticatedGuard } from './core/guards/authenticated.guard';

export const routes: Routes = [

    {
        path: 'login',
        loadComponent: () => import('./authentication/login/login.component'),
        canActivate: [AuthenticatedGuard]
    },
    {
        path: 'register',
        loadComponent: () => import('./authentication/register/register.component'),
        canActivate: [AuthGuard]
    }, 
    { 
        path: '', redirectTo: 'home', pathMatch: 'full' 
    }, 
    { 
        path: 'home', 
        loadComponent: () => import('./home//home/home.component'),
        canActivate: [AuthGuard]
    },
    {
        path: 'applicant',
         loadComponent: () => import('./applicant/applicant/applicant.component').then(m => m.ApplicantComponent)
       }
];

