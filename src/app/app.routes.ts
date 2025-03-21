import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthenticatedGuard } from './core/guards/authenticated.guard';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { BlankLayoutComponent } from './components/blank-layout/blank-layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'applicant',
    pathMatch: 'full'
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home/home.component'),
        canActivate: [AuthGuard]
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
        path: 'showApplicant',
        loadComponent: () => import('./applicant/show-applicant/show-applicant.component').then(m => m.ShowApplicantComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'pruebas',
        loadComponent: () => import('./pruebas/pruebas/pruebas.component').then(m => m.PruebasComponent)
      },
      {
        path: 'pruebas_2',
        loadComponent: () => import('./pruebas/pruebas-2/pruebas-2.component').then(m => m.Pruebas2Component)
      }
    ]
  },
  {
    path: '',
    component: BlankLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./authentication/login/login.component'),
        canActivate: [AuthenticatedGuard]
      },
      {
        path: 'reset-password',
        loadComponent: () => import('./authentication/reset-password/reset-password.component')
      },
      {
        path: 'applicant',
        loadComponent: () => import('./applicant/applicant/applicant.component').then(m => m.ApplicantComponent)
      },
      {
        path: 'creencias_personales1',
        loadComponent: () => import('./evaluacion/creenciasp/creenciasp.component').then(m => m.CreenciaspComponent)
      },
      {
        path: 'creencias_personales2',
        loadComponent: () => import('./evaluacion/creenciasp1/creenciasp1.component').then(m => m.Creenciasp1Component)
      },
      {
        path: 'creencias_personales3',
        loadComponent: () => import('./evaluacion/creenciasp2/creenciasp2.component').then(m => m.Creenciasp2Component)
      },
      {
        path: 'creencias_personales4',
        loadComponent: () => import('./evaluacion/creenciasp3/creenciasp3.component').then(m => m.Creenciasp3Component)
      },
      {
        path: 'razonamiento_numerico',
        loadComponent: () => import('./evaluacion/razonamientonum/razonamientonum.component').then(m => m.RazonamientonumComponent)
      },
      {
        path: 'razonamiento_logico',
        loadComponent: () => import('./evaluacion/razonamientolog/razonamientolog.component').then(m => m.RazonamientologComponent)
      },
      {
        path: 'conteo_figuras',
        loadComponent: () => import('./evaluacion/conteo-fig/conteo-fig.component').then(m => m.ConteoFigComponent)
      },
      {
        path: 'escenarios_realistas',
        loadComponent: () => import('./evaluacion/escenarios-realist/escenarios-realist.component').then(m => m.EscenariosRealistComponent)
      },
      {
        path: 'resolucion_problemas',
        loadComponent: () => import('./evaluacion/resolucion-problemas/resolucion-problemas/resolucion-problemas.component').then(m => m.ResolucionProblemasComponent)
      }
    ]
  }
];
