import { HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { AuthService } from './auth.service'
import { catchError, switchMap, tap, throwError } from 'rxjs'
import { DialogService } from '../shared/dialog/dialog.service'

/**
 * Requests hitting these endpoints ignore authentication.
 */
const WHITELIST = [
  '/auth/sign-up',
  '/auth/sign-in',
  '/auth/refresh',
]

/**
 * Check if the URL starts with any of the whitelisted paths
 * @param {string} url
 */
const isWhitelisted = (url: string) => WHITELIST.some(path => url.endsWith(path))

/**
 * Auth interceptor
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // If the request belongings in the WHITELIST, continue no further.
  if (isWhitelisted(req.url)) return next(req)

  const auth = inject(AuthService)
  const dialog = inject(DialogService)

  const accessToken = auth.accessToken

  // Append the access token, if it was stored.
  if (accessToken) {
    req = req.clone({
      setHeaders: {
        ...auth.addTokenToHeader(accessToken),
      },
    })
  }

  return next(req)
    .pipe(
      catchError((error) => {

        // It was not an auth error.
        if (error.status !== 401) return throwError(() => error)

        // It was an auth error, attempt to get a new token with the refresh token.
        return auth.refreshAccessToken()
          .pipe(
            // If successful, we attempt to re-do the request, with the new access token.
            switchMap(() => {
              const newAccessToken = auth.accessToken

              // Retry the request with the new token
              req = req.clone({
                setHeaders: {
                  ...auth.addTokenToHeader(newAccessToken),
                },
              })

              return next(req)
            }),
            // If not successful, the stored refresh token was invalid. The user must sign in again.
            catchError((refreshError) => {

              // Future/idea: Provide the option to sign-in again, instead of automatically signing out.
              return dialog.displayErrorDialog('Your session has expired. You will be signed-out.')
                .pipe(
                  tap(() => auth.signOut()),
                  switchMap(() => throwError(() => refreshError)),
                )
            }),
          )
      }),
    )
}
