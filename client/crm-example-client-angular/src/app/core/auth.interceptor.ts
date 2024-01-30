import { HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { AuthService } from './auth.service'
import { catchError, switchMap, throwError } from 'rxjs'

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

  const accessToken = auth.accessToken || null

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
              auth.signOut()
              return throwError(() => refreshError)

              // Below: Show dialog when session is expired.
              // Buggy - shows multiple times. To be investigated in the future.

              // Future/idea: Provide the option to sign-in again, instead of automatically signing out.

              // // Display dialog only if JWTs exist.
              // const sessionExpiredDialog = dialog.displayErrorDialog('Your session is invalid. You will be signed-out.')
              // // Do not show dialog if tokens do not exist (e.g. signed out manually).
              // const noDialog = of(null)

              // return (accessToken ? sessionExpiredDialog : noDialog)
              //   .pipe(
              //     tap(() => auth.signOut()),
              //     switchMap(() => throwError(() => refreshError)),
              //   )
            }),
          )
      }),
    )
}
