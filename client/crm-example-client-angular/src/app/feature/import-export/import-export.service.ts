import { Injectable } from '@angular/core'
import { BaseService } from '../../core/base.service'

interface IExportContactsJSONResponse {
  json: string
}

interface IImportContactsJSONResponse {
  message: string
}

@Injectable({
  providedIn: 'root',
})
export class ImportExportService extends BaseService {

  /**
   * Get contacts in a JSON string.
   */
  public exportContactsJson() {
    // return from(exportContactsJsonEndpoint(this.authService.accessToken))

    return this.getRequest<IExportContactsJSONResponse>(`${this.apiUrl}/export/contacts/json`)
  }

  public importContactsJson(json: string) {
    // return from(importContactsJsonEndpoint(this.authService.accessToken, jsonString))

    return this.postRequest<IImportContactsJSONResponse>(`${this.apiUrl}/import/contacts/json`, { json })
  }
}
