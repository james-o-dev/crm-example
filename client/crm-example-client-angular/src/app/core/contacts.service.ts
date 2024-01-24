import { Injectable } from '@angular/core'
import { environment } from '../../environments/environment'
import { BaseService } from './base.service'

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

/**
 * Send as the request body to create a new contact.
 */
export interface ICreateContactPayload {
  name: string;
  email: string;
  phone?: string;
  notes?: string;
}

/**
 * Send as the request body to update an existing contact.
 */
export interface IUpdateContactPayload {
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  contact_id: string;
}

interface ICreateContactResponse {
  message: string
  contact_id: string
}

interface IUpdateContactResponse {
  message: string
}

@Injectable({
  providedIn: 'root',
})
export class ContactService extends BaseService {

  /**
   * Returns details for a single contact that the user owns.
   *
   * @param {string} contactId
   */
  getContact(contactId: string) {
    // return from(getContactEndpoint(this.authService.accessToken, contactId))

    return this.getRequest<IGetContactResponse>(`${environment.apiUrl}/contact`, { contact_id: contactId })
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

    return this.getRequest<IGetContactsResponse>(`${environment.apiUrl}/contacts`, { archived: !active })
  }

  /**
   * Update an existing contact that the user owns.
   *
   * @param {IUpdateContactPayload} payload
   */
  updateContact(payload: IUpdateContactPayload) {
    // return from(updateContactEndpoint(this.authService.accessToken, payload))

    return this.putRequest<IUpdateContactResponse>(`${environment.apiUrl}/contact`, payload)
  }

  /**
   * Create a new contact, owned by the user
   *
   * @param {ICreateContactPayload} payload
   */
  newContact(payload: ICreateContactPayload) {
    // return from(newContactEndpoint(this.authService.accessToken, payload))

    return this.postRequest<ICreateContactResponse>(`${environment.apiUrl}/contact`, payload)
  }

  /**
   * Archive an existing contact, owned by the user
   *
   * @param {string} contactId
   */
  archiveContact(contactId: string) {
    // return from(archiveContactEndpoint(this.auth.accessToken, contactId))

    return this.putRequest(`${environment.apiUrl}/contact/archived`, {
      contact_id: contactId,
      archived: true,
    })
  }

  /**
   * Restore an existing archived contact, owned by the user.
   *
   * @param {string} contactId
   */
  restoreContact(contactId: string) {
    // return from(restoreContactEndpoint(this.auth.accessToken, contactId))

    return this.putRequest(`${environment.apiUrl}/contact/archived`, {
      contact_id: contactId,
      archived: false,
    })
  }
}
