import { Injectable, computed, signal } from '@angular/core'
import { BaseService } from './base.service'

export interface INotificationDetail {
  type: 'task_overdue' | 'task_soon'
  title: string
  message: string
  key: string
}

interface INotificationCountResponse {
  count: string
}

interface INotificationDetailResponse {
  detail: INotificationDetail[]
}

@Injectable({
  providedIn: 'root',
})
export class NotificationsService extends BaseService {
  private manualTriggerNotificationNumber = signal(Math.random())

  /**
   * This is the Angular signal to trigger updating the notification number in the top bar.
   */
  public updateNotificationNumberSignal = computed(() => {
    if (this.auth.hasAuthenticated()) return this.manualTriggerNotificationNumber()
    return null
  })

  /**
   * Get notification details, for this user.
   */
  public getNotificationsDetail() {
    return this.getRequest<INotificationDetailResponse>(`${this.apiUrl}/notifications/detail`)
  }

  /**
   * Get notification number only, for this user.
   */
  public getNotificationsCount() {
    return this.getRequest<INotificationCountResponse>(`${this.apiUrl}/notifications/count`)
  }

  /**
   * It updates the Angular signal in order to trigger updating the notification number in the top bar.
   */
  public triggerNumberUpdateEvent() {
    this.manualTriggerNotificationNumber.set(Math.random())
  }
}
