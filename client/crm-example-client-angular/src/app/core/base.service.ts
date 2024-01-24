import { Injectable, inject } from '@angular/core'
import { AuthService } from './auth.service'
import { HttpClient, HttpHeaders } from '@angular/common/http'

interface IQueryParams {
  [param: string]: string | number | boolean
}

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  protected auth = inject(AuthService)
  protected http = inject(HttpClient)

  protected getRequest<T>(url: string, params?: IQueryParams, headers?: HttpHeaders) {
    return this.http.get<T>(url, { headers: { ...this.auth.addTokenToHeader(), ...headers }, params })
  }

  protected postRequest<T>(url: string, body: object, params?: IQueryParams, headers?: HttpHeaders) {
    return this.http.post<T>(url, body, { headers: { ...this.auth.addTokenToHeader(), ...headers }, params })
  }

  protected putRequest<T>(url: string, body: object, params?: IQueryParams, headers?: HttpHeaders) {
    return this.http.put<T>(url, body, { headers: { ...this.auth.addTokenToHeader(), ...headers }, params })
  }

  protected deleteRequest<T>(url: string, params?: IQueryParams, headers?: HttpHeaders) {
    return this.http.delete<T>(url, { headers: { ...this.auth.addTokenToHeader(), ...headers }, params })
  }
}
