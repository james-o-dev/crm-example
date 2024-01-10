import { Routes } from '@angular/router'

export const routes: Routes = [
  { path: 'sign-up', pathMatch: 'full', loadComponent: () => import('./feature/sign-up/sign-up.component').then(m => m.SignUpComponent) },
  { path: 'sign-in', pathMatch: 'full', loadComponent: () => import('./feature/sign-in/sign-in.component').then(m => m.SignInComponent) },
  { path: '', redirectTo: 'sign-up', pathMatch: 'full' },
]
