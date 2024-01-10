import { Routes } from '@angular/router'

export const routes: Routes = [
  { path: 'sign-up', pathMatch: 'full', loadComponent: () => import('./feature/sign-up/sign-up.component').then(m => m.SignUpComponent) },
  { path: 'sign-in', pathMatch: 'full', loadComponent: () => import('./feature/sign-in/sign-in.component').then(m => m.SignInComponent) },
  { path: 'home', pathMatch: 'full', loadComponent: () => import('./feature/home/home.component').then(m => m.HomeComponent) },
  { path: 'user-profile', pathMatch: 'full', loadComponent: () => import('./feature/user-profile/user-profile.component').then(m => m.UserProfileComponent) },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
]
