import { Injectable } from '@angular/core'
import { signInEndpoint, signUpEndpoint } from './mock-auth'
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
