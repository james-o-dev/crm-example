import { Injectable } from '@angular/core'
import { signInEndpoint, signUpEndpoint } from './auth.mock'
import { from } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor() { }

  signUp(email: string) {
    return from(signUpEndpoint(email))
  }

  signIn(email: string) {
    return from(signInEndpoint(email))
  }
}
