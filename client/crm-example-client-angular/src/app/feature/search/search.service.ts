import { Injectable, inject } from '@angular/core'
import { from } from 'rxjs'
import { searchEndpoint } from '../../core/mock/search.mock'
import { AuthService } from '../../core/auth.service'

export interface ISearchResponse {
  name: string
  key: string
  type: 'contact' | 'task'
}

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private authService = inject(AuthService)

  search(q: string) {
    return from(searchEndpoint(this.authService.accessToken, q))
  }
}
