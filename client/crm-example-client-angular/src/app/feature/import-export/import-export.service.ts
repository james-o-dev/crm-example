import { Injectable, inject } from '@angular/core'
import { from } from 'rxjs'
import { exportContactsJsonEndpoint, importContactsJsonEndpoint } from '../../../assets/js/mock/import-export.mock'
import { AuthService } from '../../core/auth.service'

@Injectable({
  providedIn: 'root',
})
export class ImportExportService {
  private authService = inject(AuthService)

  public exportContactsJson() {
    return from(exportContactsJsonEndpoint(this.authService.accessToken))
  }

  public importContactsJson(jsonString: string) {
    return from(importContactsJsonEndpoint(this.authService.accessToken, jsonString))
  }
}
