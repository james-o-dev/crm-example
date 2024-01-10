import { Injectable } from '@angular/core'
import { signInEndpoint, signUpEndpoint } from './auth.mock'
import { from } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor() { }

  /**
   * Request to sign up a user.
   * * TODO: Placeholder
   *
   * @param {string} email
   */
  signUp(email: string) {
    // From mock DB.
    return from(signUpEndpoint(email))
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
    // API Endpoint.
    // TODO
  }
}
