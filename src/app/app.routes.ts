import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { ApplicationList } from './features/applications/application-list/application-list';
import { ApplicationForm } from './features/applications/application-form/application-form';
import { ApplicationDetail } from './features/applications/application-detail/application-detail';
import { Login } from './features/auth/login/login';
import { Profile } from './features/profile/profile';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
    canActivate: [guestGuard],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: () => localStorage.getItem('isLoggedIn') === 'true' ? '/dashboard' : '/login',
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
  },
  {
    path: 'applications',
    component: ApplicationList,
    canActivate: [authGuard],
  },
  {
    path: 'applications/add',
    component: ApplicationForm,
    canActivate: [authGuard],
  },
  {
    path: 'applications/:id',
    component: ApplicationDetail,
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];