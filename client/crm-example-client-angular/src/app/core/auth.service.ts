import { Injectable, inject, signal } from '@angular/core'
import { catchError, map, of, tap } from 'rxjs'
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'

interface ReceiveJWTResponse {
  accessToken: string
  // refreshToken: string // Future.
  [key: string]: string
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient)
  private router = inject(Router)

  public hasAuthenticated = signal(false)

  get accessToken() {
    return localStorage.getItem('accessToken') || ''
  }
  set accessToken(accessToken: string) {
    localStorage.setItem('accessToken', accessToken)
  }

  private addTokenToHeader(token = this.accessToken) {
    return {
      'authorization': `Bearer ${token}`,
    }
  }

  /**
   * Request to sign up a user.
   * * TODO: Placeholder
   *
   * @param {string} email
   */
  public signUp(email: string, password: string, confirmPassword: string) {
    // From mock DB.
    // return from(signUpEndpoint(email))
    //   .pipe(
    //     tap(data => {
    //       if (data.statusCode === 201) {
    //         this.accessToken = data.accessToken as string
    //         this.hasAuthenticated.set(true)
    //       }
    //     }),
    //   )
    // API Endpoint.
    // TODO

    return this.http.post<ReceiveJWTResponse>(`${environment.apiUrl}/auth/sign-up`, { email, password, confirmPassword })
      .pipe(
        tap(data => {
          this.accessToken = data.accessToken as string
          this.hasAuthenticated.set(true)
        }),
      )
  }

  /**
   * Request to sign in a user.
   * * TODO: Placeholder
   *
   * @param {string} email
   */
  public signIn(email: string, password: string) {
    // From mock DB.
    // return from(signInEndpoint(email))
    //   .pipe(
    //     tap(data => {
    //       if (data.statusCode === 200) {
    //         this.accessToken = data.accessToken as string
    //         this.hasAuthenticated.set(true)
    //       }
    //     }),
    //   )
    // API Endpoint.
    // TODO

    return this.http.post<ReceiveJWTResponse>(`${environment.apiUrl}/auth/sign-in`, { email, password })
      .pipe(
        tap(data => {
          this.accessToken = data.accessToken as string
          this.hasAuthenticated.set(true)
        }),
      )
  }

  public isAuthenticated() {
    // Mock.
    // return from(isAuthenticatedEndpoint(this.accessToken))
    //   .pipe(tap(data => {
    //     if (data.ok && data.statusCode === 200) {
    //       this.hasAuthenticated.set(true)
    //     }
    //   }))

    // API.
    return this.http.get(`${environment.apiUrl}/auth/authenticate`, {
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

  public signOut() {
    this.hasAuthenticated.set(false)
    localStorage.removeItem('accessToken')
    this.router.navigate(['/sign-in'])
  }
}
