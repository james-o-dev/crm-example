import { Injectable, inject } from '@angular/core'
import { from } from 'rxjs'
import { archiveContactEndpoint, restoreContactEndpoint } from '../../assets/js/mock/contacts.mock'
import { AuthService } from './auth.service'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'

export interface IContact {
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  date_modified?: number;
  date_created?: number;
  contact_id?: string;
  user_id?: string;
  archived?: boolean;

  [key: string]: string | number | undefined | boolean;
}

export interface IGetContactsResponse {
  contacts: IContact[]
}

export interface IGetContactResponse {
  contact: IContact
}

export interface IContactUpdatePayload {
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  contact_id: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private authService = inject(AuthService)
  private http = inject(HttpClient)

  getContact(contactId: string) {
    // return from(getContactEndpoint(this.authService.accessToken, contactId))
    return this.http.get<IGetContactResponse>(`${environment.apiUrl}/contact`, {
      params: {
        contact_id: contactId,
      },
      headers: {
        ...this.authService.addTokenToHeader(),
      },
    })
  }

  /**
   * Get a list of contacts
   *
   * @param {boolean} [active=true] True to only return active contacts; False to return archived contacts.
   */
  getContacts(active = true) {
    // // Determine filters.
    // const filters: { archived?: boolean } = {}
    // filters.archived = !active

    // return from(getContactsEndpoint(this.authService.accessToken, filters))
    return this.http.get<IGetContactsResponse>(`${environment.apiUrl}/contacts`, {
      params: {
        archived: !active,
      },
      headers: {
        ...this.authService.addTokenToHeader(),
      },
    })
  }

  updateContact(payload: IContactUpdatePayload) {
    // return from(updateContactEndpoint(this.authService.accessToken, payload))

    return this.http.put(`${environment.apiUrl}/contact`, payload, {
      headers: {
        ...this.authService.addTokenToHeader(),
      },
    })
  }

  newContact(payload: IContact) {
    // return from(newContactEndpoint(this.authService.accessToken, payload))
    return this.http.post(`${environment.apiUrl}/contacts`, payload, {
      headers: {
        ...this.authService.addTokenToHeader(),
      },
    })
  }

  archiveContact(contactId: string) {
    return from(archiveContactEndpoint(this.authService.accessToken, contactId))
  }

  restoreContact(contactId: string) {
    return from(restoreContactEndpoint(this.authService.accessToken, contactId))
  }
}
