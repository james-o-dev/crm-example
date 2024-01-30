import { Injectable } from '@angular/core'
import { BaseService } from '../../core/base.service'

interface IGetUsernameResponse {
  username: string
}

interface ISetUsernameResponse {
  message: string
}

interface IChangePasswordResponse {
  message: string
}

interface ISignOutEverywhereResponse {
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

  /**
   * Change the user's password.
   *
   * @param {string} oldPassword
   * @param {string} newPassword
   * @param {string} confirmPassword
   */
  public changePassword(oldPassword: string, newPassword: string, confirmPassword: string) {
    return this.putRequest<IChangePasswordResponse>(`${this.apiUrl}/auth/change-password`, {
      oldPassword, newPassword, confirmPassword,
    })
  }

  /**
   * Change the user's password.
   */
  public signOutEverywhere() {
    return this.getRequest<ISignOutEverywhereResponse>(`${this.apiUrl}/auth/sign-out-everywhere`)
  }
}
