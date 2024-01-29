import { Injectable } from '@angular/core'
import { BaseService } from '../../core/base.service'

interface IGetUsernameResponse {
  username: string
}

interface ISetUsernameResponse {
  message: string
}

@Injectable({
  providedIn: 'root',
})
export class UserProfileService extends BaseService {

  /**
   * Get the user's username.
   */
  public getUsername() {
    return this.getRequest<IGetUsernameResponse>(`${this.apiUrl}/user/username`)
  }

  /**
   * Set the user's username.
   *
   * @param {string} username
   */
  public setUsername(username: string) {
    return this.putRequest<ISetUsernameResponse>(`${this.apiUrl}/user/username`, { username })
  }
}
