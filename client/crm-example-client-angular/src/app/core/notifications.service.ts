import { Injectable, inject, signal } from '@angular/core'
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

  /**
   * This is the Angular signal to trigger updating the notification number in the top bar.
   */
  public updateNotificationNumberSignal = signal(true)

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

  /**
   * It updates the Angular signal in order to trigger updating the notification number in the top bar.
   */
  public triggerNumberUpdateEvent() {
    this.updateNotificationNumberSignal.update(v => !v)
  }
}
