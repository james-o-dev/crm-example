import { Injectable, inject } from '@angular/core'
import { from } from 'rxjs'
import { deleteTaskEndpoint, updateTaskEndpoint } from '../../assets/js/mock/tasks.mock'
import { AuthService } from './auth.service'
import { BaseService } from './base.service'

// export interface ITask {
//   contact_id?: string
//   contact_name?: string
//   date_created: number
//   date_modified: number
//   due_date?: number
//   key: string
//   notes?: string
//   title: string
//   user_id: string
// }

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
  contact_id?: string
  contact_name?: string
}

interface IGetTasksResponse {
  tasks: IGetTasks[]
}

export interface IGetTask {
  title: string
  notes?: string
  due_date?: string
  contact_id?: string
  contact_name?: string
  date_created: string
  date_modified: string
}

interface IGetTaskResponse {
  task: IGetTask
}

interface ICreateTaskPayload {
  title: string
  due_date: Date
  notes: string
  contact_id: string
}

interface ICreateTaskResponse {
  message: string
  task_id: string
}

@Injectable({
  providedIn: 'root',
})
export class TasksService extends BaseService {
  private authService = inject(AuthService)

  public addTask(payload: ICreateTaskPayload) {
    // if (typeof payload?.due_date === 'string' || typeof payload?.due_date === 'object') {
      // payload.due_date = new Date(payload.due_date).getTime()
    // }
    // return from(addTaskEndpoint(this.authService.accessToken, payload))

    const requestPayload = {
      ...payload,
      due_date: new Date(payload.due_date).getTime(), // Convert Date object into unix timestamp number.
    }
    return this.postRequest<ICreateTaskResponse>(`${this.apiUrl}/task`, requestPayload)
  }

  public updateTask(payload: ITaskUpdate) {
    if (typeof payload?.due_date === 'string' || typeof payload?.due_date === 'object') {
      payload.due_date = new Date(payload.due_date).getTime()
    }

    return from(updateTaskEndpoint(this.authService.accessToken, payload))
  }

  /**
   * Get a task, belonging to the user.
   *
   * @param {string} taskId
   */
  public getTask(taskId: string) {
    // return from(getTaskEndpoint(this.authService.accessToken, taskId))

    return this.getRequest<IGetTaskResponse>(`${this.apiUrl}/task`, { task_id: taskId })
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
