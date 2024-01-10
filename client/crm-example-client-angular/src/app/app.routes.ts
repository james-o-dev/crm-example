import { Routes } from '@angular/router'

export const routes: Routes = [
  { path: 'sign-up', loadComponent: () => import('./feature/sign-up/sign-up.component').then(m => m.SignUpComponent) },
  { path: 'sign-in', loadComponent: () => import('./feature/sign-in/sign-in.component').then(m => m.SignInComponent) },
  { path: 'home', loadComponent: () => import('./feature/home/home.component').then(m => m.HomeComponent) },
  { path: 'user-profile', loadComponent: () => import('./feature/user-profile/user-profile.component').then(m => m.UserProfileComponent) },
  // Default route; Will redirect to here if a path is not found.
  { path: '**', redirectTo: 'home'  },
]
