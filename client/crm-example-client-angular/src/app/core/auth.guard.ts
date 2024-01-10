import { CanActivateFn } from '@angular/router'
import { AuthService } from './auth.service'
import { tap } from 'rxjs'
import { inject } from '@angular/core'

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService)

  return auth.isAuthenticated()
    .pipe(
      tap(data => {
        // Redirect to Sign In if not authenticated.
        if (!data) {
          auth.signOut()
        }
      }),
    )
}
