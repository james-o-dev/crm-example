import { Injectable } from '@angular/core'
import { isAuthenticatedEndpoint, signInEndpoint, signUpEndpoint } from './mock/auth.mock'
import { from, tap } from 'rxjs'
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private router: Router) { }

  get accessToken() {
    return localStorage.getItem('accessToken') || ''
  }
  set accessToken(accessToken: string) {
    localStorage.setItem('accessToken', accessToken)
  }

  /**
   * Request to sign up a user.
   * * TODO: Placeholder
   *
   * @param {string} email
   */
  signUp(email: string) {
    // From mock DB.
    return from(signUpEndpoint(email))
      .pipe(
        tap(data => {
          if (data.statusCode === 201) this.accessToken = data.accessToken as string
        }),
      )
    // API Endpoint.
    // TODO
  }

  /**
   * Request to sign in a user.
   * * TODO: Placeholder
   *
   * @param {string} email
   */
  signIn(email: string) {
    // From mock DB.
    return from(signInEndpoint(email))
      .pipe(
        tap(data => {
          if (data.statusCode === 200) this.accessToken = data.accessToken as string
        }),
      )
    // API Endpoint.
    // TODO
  }

  isAuthenticated() {
    // Mock.
    return from(isAuthenticatedEndpoint(this.accessToken))

    // API.
    // TODO
  }

  signOut() {
    localStorage.removeItem('accessToken')
    this.router.navigate(['/sign-in'])
  }
}
