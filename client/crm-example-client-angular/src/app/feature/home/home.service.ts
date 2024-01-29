import { Injectable } from '@angular/core'
import { BaseService } from '../../core/base.service'

interface IHomeMetadata {
  contacts: number
  tasks: number
  tasks_overdue: number
}

interface IHomeMetadataResponse {
  data: IHomeMetadata
}

@Injectable({
  providedIn: 'root',
})
export class HomeService extends BaseService {
  public getHomeMetadata() {
    return this.getRequest<IHomeMetadataResponse>(`${this.apiUrl}/dashboard`)
  }
}
