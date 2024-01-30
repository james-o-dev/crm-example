import { Injectable, inject, signal } from '@angular/core'
import { catchError, map, of, tap } from 'rxjs'
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { DialogService } from '../shared/dialog/dialog.service'

interface IReceiveJWTResponse {
  accessToken: string
  refreshToken: string // Future.
  message?: string
}

interface IIsAuthenticatedResponse {
  message: string
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private dialog = inject(DialogService)
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

  get refreshToken() {
    return localStorage.getItem('refreshToken') || ''
  }
  set refreshToken(refreshToken: string) {
    localStorage.setItem('refreshToken', refreshToken)
  }

  public PASSWORD_REGEXP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+-])[A-Za-z\d!@#$%^&*()_+-]{8,}$/
  public PASSWORD_REGEXP_MESSAGE = 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*()_+-), with a minimum length of 8 characters.'

  // Standard email format. Also includes '+' symbol.
  public EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

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
   * Attempt to get a new access token, with a refresh token.
   */
  public refreshAccessToken() {
    return this.http.get<IReceiveJWTResponse>(`${environment.apiUrl}/auth/refresh`, {
      headers: {
        ...this.addTokenToHeader(this.refreshToken),
      },
    })
      .pipe(
        tap(data => {
          this.accessToken = data.accessToken
          this.hasAuthenticated.set(true)
        }),
      )
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
          this.accessToken = data.accessToken
          this.refreshToken = data.refreshToken
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
          this.accessToken = data.accessToken
          this.refreshToken = data.refreshToken
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
    return this.http.get<IIsAuthenticatedResponse>(`${environment.apiUrl}/auth/authenticate`)
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
    localStorage.removeItem('refreshToken')
    this.router.navigate(['/sign-in'])
  }

  /**
   * Opens a dialog to display information regarding valid password rules.
   */
  public openPasswordInfoDialog() {
    this.dialog.displayDialog('Password', [this.PASSWORD_REGEXP_MESSAGE], [{ text: 'OK' }])
  }
}
