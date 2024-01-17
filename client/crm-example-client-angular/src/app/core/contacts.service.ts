import { Injectable, inject } from '@angular/core'
import { from } from 'rxjs'
import { archiveContactEndpoint, getContactEndpoint, getContactsEndpoint, newContactEndpoint, restoreContactEndpoint, updateContactEndpoint } from '../../assets/js/mock/contacts.mock'
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
  archived?: boolean;

  [key: string]: string | number | undefined | boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private authService = inject(AuthService)

  getContact(contactId: string) {
    return from(getContactEndpoint(this.authService.accessToken, contactId))
  }

  /**
   * Get a list of contacts
   *
   * @param {boolean} [active=true] True to only return active contacts; False to return archived contacts.
   */
  getContacts(active = true) {
    // Determine filters.
    const filters: { archived?: boolean } = {}
    filters.archived = !active

    return from(getContactsEndpoint(this.authService.accessToken, filters))
  }

  updateContact(payload: IContact) {
    return from(updateContactEndpoint(this.authService.accessToken, payload))
  }

  newContact(payload: IContact) {
    return from(newContactEndpoint(this.authService.accessToken, payload))
  }

  archiveContact(contactId: string) {
    return from(archiveContactEndpoint(this.authService.accessToken, contactId))
  }

  restoreContact(contactId: string) {
    return from(restoreContactEndpoint(this.authService.accessToken, contactId))
  }
}
