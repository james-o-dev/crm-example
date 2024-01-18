import { Route, Routes } from '@angular/router'
import { authGuard } from './core/auth.guard'

// These routes do not require authentication.
const unguardedRoutes: Routes = [
  { path: 'sign-up', loadComponent: () => import('./feature/sign-up/sign-up.component').then(m => m.SignUpComponent) },
  { path: 'sign-in', loadComponent: () => import('./feature/sign-in/sign-in.component').then(m => m.SignInComponent) },
]

// These routes require authentication.
const guardedRoutes: Routes = [
  { path: 'home', loadComponent: () => import('./feature/home/home.component').then(m => m.HomeComponent) },
  { path: 'user-profile', loadComponent: () => import('./feature/user-profile/user-profile.component').then(m => m.UserProfileComponent) },
  { path: 'add-contact', loadComponent: () => import('./feature/add-contact/add-contact.component').then(m => m.AddContactComponent) },
  { path: 'contacts', loadComponent: () => import('./feature/contacts/contacts.component').then(m => m.ContactsComponent) },
  { path: 'contact-detail/:contactId', loadComponent: () => import('./feature/contact-detail/contact-detail.component').then(m => m.ContactDetailComponent) },
  { path: 'add-task', loadComponent: () => import('./feature/add-task/add-task.component').then(m => m.AddTaskComponent) },
  { path: 'tasks', loadComponent: () => import('./feature/tasks/tasks.component').then(m => m.TasksComponent) },
  { path: 'task-detail/:taskId', loadComponent: () => import('./feature/task-detail/task-detail.component').then(m => m.TaskDetailComponent) },
  { path: 'search', loadComponent: () => import('./feature/search/search.component').then(m => m.SearchComponent) },
  { path: 'import-export', loadComponent: () => import('./feature/import-export/import-export.component').then(m => m.ImportExportComponent) },
  { path: 'notifications', loadComponent: () => import('./feature/notifications/notifications.component').then(m => m.NotificationsComponent) },
].map((r: Route) => {
  // Guarded routes require the AuthGuard service.
  r.canActivate = [authGuard]
  return r
})

// All routes.
export const routes: Routes = [
  ...unguardedRoutes,
  ...guardedRoutes,
  // Default route; Will redirect to here if a path is not found.
  { path: '**', redirectTo: 'home' },
]
