import { Injectable } from '@angular/core'
import { BaseService } from '../../core/base.service'

export interface ISearch {
  name: string
  key: string
  type: 'contact' | 'task'
}

interface ISearchResponse {
  found: ISearch[]
}

@Injectable({
  providedIn: 'root',
})
export class SearchService extends BaseService {

  search(q: string) {
    return this.getRequest<ISearchResponse>(`${this.apiUrl}/search`, { q })
  }
}
