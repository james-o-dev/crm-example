import { getHomeMetadataEndpoint } from '../../../assets/js/mock/meta.mock'
import { Injectable, inject } from '@angular/core'
import { AuthService } from '../../core/auth.service'
import { from } from 'rxjs'

export interface IHomeMetadata {
  contacts: number
  tasks: number
  tasks_overdue: number
}

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private authService = inject(AuthService)

  public getHomeMetadata() {
    return from(getHomeMetadataEndpoint(this.authService.accessToken))
  }
}
