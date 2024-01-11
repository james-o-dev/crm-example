import { Injectable } from '@angular/core'
import { from } from 'rxjs'
import { newContactEndpoint } from './mock/contacts.mock'
import { AuthService } from './auth.service'

export interface IContact {
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {

  constructor(
    private authService: AuthService,
  ) { }

  getContact() {
    // TODO
  }

  setContact() {
    // TODO
  }

  newContact(payload: IContact) {
    return from(newContactEndpoint(this.authService.accessToken, payload))
  }
}
