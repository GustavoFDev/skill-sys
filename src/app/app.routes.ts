import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path: 'login',
        loadComponent: () => import('./authentication/login/login.component')
    },
    {
        path: 'register',
        loadComponent: () => import('./authentication/register/register.component')
    }, 
    { 
        path: '', redirectTo: 'home', pathMatch: 'full' 
    }, 
    { 
        path: 'home', 
        loadComponent: () => import('./home/home/home.component')
    },
    {
        path: 'applicant',
         loadComponent: () => import('./applicant/applicant/applicant.component').then(m => m.ApplicantComponent)
       }
];

