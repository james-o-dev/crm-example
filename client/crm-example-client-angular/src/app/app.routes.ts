import { Routes } from '@angular/router'
import { authGuard } from './core/auth.guard'

export const routes: Routes = [
  // No Auth.
  { path: 'sign-up', loadComponent: () => import('./feature/sign-up/sign-up.component').then(m => m.SignUpComponent) },
  { path: 'sign-in', loadComponent: () => import('./feature/sign-in/sign-in.component').then(m => m.SignInComponent) },
  // Auth.
  { path: 'home', canActivate: [authGuard], loadComponent: () => import('./feature/home/home.component').then(m => m.HomeComponent) },
  { path: 'user-profile', canActivate: [authGuard], loadComponent: () => import('./feature/user-profile/user-profile.component').then(m => m.UserProfileComponent) },
  { path: 'add-contact', canActivate: [authGuard], loadComponent: () => import('./feature/add-contact/add-contact.component').then(m => m.AddContactComponent) },
  { path: 'contacts', canActivate: [authGuard], loadComponent: () => import('./feature/contacts/contacts.component').then(m => m.ContactsComponent) },
  { path: 'contact-detail/:contactId', canActivate: [authGuard], loadComponent: () => import('./feature/contact-detail/contact-detail.component').then(m => m.ContactDetailComponent) },
  { path: 'add-task', canActivate: [authGuard], loadComponent: () => import('./feature/add-task/add-task.component').then(m => m.AddTaskComponent) },
  { path: 'tasks', canActivate: [authGuard], loadComponent: () => import('./feature/tasks/tasks.component').then(m => m.TasksComponent) },
  { path: 'task-detail/:taskId', canActivate: [authGuard], loadComponent: () => import('./feature/task-detail/task-detail.component').then(m => m.TaskDetailComponent) },
  { path: 'search', canActivate: [authGuard], loadComponent: () => import('./feature/search/search.component').then(m => m.SearchComponent) },
  // Default route; Will redirect to here if a path is not found.
  { path: '**', redirectTo: 'home' },
]
