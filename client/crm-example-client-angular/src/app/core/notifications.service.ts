import { Injectable, inject } from '@angular/core'
import { AuthService } from './auth.service'
import { from } from 'rxjs'
import { getNotificationsEndpoint } from '../../assets/js/mock/notifications.mock'

export interface INotificationDetail {
  type: 'task_overdue' | 'task_soon'
  title: string
  message: string
  key?: string
}

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private authService = inject(AuthService)

  constructor() { }

  /**
   * Get notification details, for this user.
   */
  public getNotificationsDetails () {
    return from(getNotificationsEndpoint(this.authService.accessToken, false))
  }

  /**
   * Get notification number only, for this user.
   */
  public getNotificationsNumberOnly() {
    return from(getNotificationsEndpoint(this.authService.accessToken, true))
  }
}
