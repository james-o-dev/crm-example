import { Injectable, inject, signal } from '@angular/core'
import { catchError, map, of, tap } from 'rxjs'
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'

interface IReceiveJWTResponse {
  accessToken: string
  // refreshToken: string // Future.
  message: string
}

interface IIsAuthenticatedResponse {
  message: string
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient)
  private router = inject(Router)

  /**
   * Signal if the user is authenticated.
   */
  public hasAuthenticated = signal(false)

  get accessToken() {
    return localStorage.getItem('accessToken') || ''
  }
  set accessToken(accessToken: string) {
    localStorage.setItem('accessToken', accessToken)
  }

  /**
   * Returns an object to be used in the request, to include the 'authorization' header.
   *
   * @param {string} [token]
   *
   * @example { 'headers': { ...this.addTokenToHeader } }
   */
  public addTokenToHeader(token = this.accessToken) {
    return {
      'authorization': `Bearer ${token}`,
    }
  }

  /**
   * Request to sign up a user.
   *
   * @param {string} email
   */
  public signUp(email: string, password: string, confirmPassword: string) {
    return this.http.post<IReceiveJWTResponse>(`${environment.apiUrl}/auth/sign-up`, { email, password, confirmPassword })
      .pipe(
        tap(data => {
          this.accessToken = data.accessToken as string
          this.hasAuthenticated.set(true)
        }),
      )
  }

  /**
   * Request to sign in a user.
   *
   * @param {string} email
   */
  public signIn(email: string, password: string) {

    return this.http.post<IReceiveJWTResponse>(`${environment.apiUrl}/auth/sign-in`, { email, password })
      .pipe(
        tap(data => {
          this.accessToken = data.accessToken as string
          this.hasAuthenticated.set(true)
        }),
      )
  }

  /**
   * Determine if the user has been authenticated.
   * * Will return 200 if authenticated
   * * Will return 401 if unable to be unauthenticated
   */
  public isAuthenticated() {
    return this.http.get<IIsAuthenticatedResponse>(`${environment.apiUrl}/auth/authenticate`, {
      headers: {
        ...this.addTokenToHeader(),
      },
    })
    .pipe(
      map(() => true),
      catchError(() => of(false)),
      tap((authenticated: boolean) => this.hasAuthenticated.set(authenticated)),
    )
  }

  /**
   * Sign-out client side.
   */
  public signOut() {
    this.hasAuthenticated.set(false)
    localStorage.removeItem('accessToken')
    this.router.navigate(['/sign-in'])
  }
}
