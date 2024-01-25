import { Injectable, inject } from '@angular/core'
import { from } from 'rxjs'
import { addTaskEndpoint, deleteTaskEndpoint, getTaskEndpoint, updateTaskEndpoint } from '../../assets/js/mock/tasks.mock'
import { AuthService } from './auth.service'
import { BaseService } from './base.service'

export interface ITask {
  contact_id?: string
  contact_name?: string
  date_created: number
  date_modified: number
  due_date?: number
  key: string
  notes?: string
  title: string
  user_id: string
}

export interface ITaskAdd {
  due_date?: number
  notes?: string
  title: string
}

export interface ITaskUpdate {
  due_date?: number
  key: string
  notes?: string
  title: string
}

export interface IGetTasks {
  task_id: string
  title: string
  due_date?: string
  contact_name?: string
}

interface IGetTasksResponse {
  tasks: IGetTasks[]
}

@Injectable({
  providedIn: 'root',
})
export class TasksService extends BaseService {
  private authService = inject(AuthService)

  public addTask(payload: ITaskAdd) {
    if (typeof payload?.due_date === 'string' || typeof payload?.due_date === 'object') {
      payload.due_date = new Date(payload.due_date).getTime()
    }
    return from(addTaskEndpoint(this.authService.accessToken, payload))
  }

  public updateTask(payload: ITaskUpdate) {
    if (typeof payload?.due_date === 'string' || typeof payload?.due_date === 'object') {
      payload.due_date = new Date(payload.due_date).getTime()
    }

    return from(updateTaskEndpoint(this.authService.accessToken, payload))
  }

  public getTask(taskId: string) {
    return from(getTaskEndpoint(this.authService.accessToken, taskId))
  }

  /**
   * Get tasks list.
   *
   * @param {string} [contactId]
   */
  public getTasks(contactId = '') {
    // return from(getTasksEndpoint(this.authService.accessToken, contactId))

    return this.getRequest<IGetTasksResponse>(`${this.apiUrl}/tasks`, { contact_id: contactId })
  }

  public deleteTask(taskId: string) {
    return from(deleteTaskEndpoint(this.authService.accessToken, taskId))
  }
}
