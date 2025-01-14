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
    },
    {
        path: 'users',
         loadComponent: () => import('./users/users.component').then(m => m.UsersComponent),
         canActivate: [AuthGuard]
    },
    {
        path: 'test_view',
         loadComponent: () => import('./test_view/test_view/test-view.component').then(m => m.TestViewComponent),
         canActivate: [AuthGuard]

    },
    {
        path: 'creencias_personales1',
         loadComponent: () => import('./evaluacion/creenciasp/creenciasp.component').then(m => m.CreenciaspComponent)
    },
    {
        path: 'pruebas',
         loadComponent: () => import('./pruebas/pruebas/pruebas.component').then(m => m.PruebasComponent)

    }
    ,
    {
        path: 'pruebas_2',
         loadComponent: () => import('./pruebas/pruebas-2/pruebas-2.component').then(m => m.Pruebas2Component)

    }
];

