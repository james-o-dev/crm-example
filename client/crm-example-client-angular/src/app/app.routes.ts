import { Routes } from '@angular/router'
import { authGuard } from './core/auth.guard'

export const routes: Routes = [
  // No Auth.
  { path: 'sign-up', loadComponent: () => import('./feature/sign-up/sign-up.component').then(m => m.SignUpComponent) },
  { path: 'sign-in', loadComponent: () => import('./feature/sign-in/sign-in.component').then(m => m.SignInComponent) },
  // Auth.
  { path: 'home', canActivate: [authGuard], loadComponent: () => import('./feature/home/home.component').then(m => m.HomeComponent) },
  { path: 'user-profile', canActivate: [authGuard], loadComponent: () => import('./feature/user-profile/user-profile.component').then(m => m.UserProfileComponent) },
  { path: 'add-contact', canActivate: [authGuard], loadComponent: () => import('./feature/add-contact/add-contact.component').then(m => m.AddContactComponent ) },
  { path: 'contacts', canActivate: [authGuard], loadComponent: () => import('./feature/contacts/contacts.component').then(m => m.ContactsComponent ) },
  // Default route; Will redirect to here if a path is not found.
  { path: '**', redirectTo: 'home'  },
]
