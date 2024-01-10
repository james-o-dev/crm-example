import { Injectable } from '@angular/core'
import { signUpEndpoint } from './mock-auth'
import { from } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor() { }

  signUp(email: string) {
    return from(signUpEndpoint(email))
  }
}
