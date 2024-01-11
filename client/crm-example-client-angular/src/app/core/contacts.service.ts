import { Injectable, inject } from '@angular/core'
import { from } from 'rxjs'
import { getContactEndpoint, getContactsEndpoint, newContactEndpoint, updateContactEndpoint } from './mock/contacts.mock'
import { AuthService } from './auth.service'

export interface IContact {
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  date_modified?: number;
  date_created?: number;
  key?: string;
  user_id?: string;

  [key: string]: string | number | undefined;
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private authService = inject(AuthService)

  getContact(contactId: string) {
    return from(getContactEndpoint(this.authService.accessToken, contactId))
  }

  getContacts() {
    return from(getContactsEndpoint(this.authService.accessToken))
  }

  updateContact(payload: IContact) {
    return from(updateContactEndpoint(this.authService.accessToken, payload))
  }

  newContact(payload: IContact) {
    return from(newContactEndpoint(this.authService.accessToken, payload))
  }
}
