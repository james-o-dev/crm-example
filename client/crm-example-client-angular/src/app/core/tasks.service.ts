import { Injectable } from '@angular/core'
import { BaseService } from './base.service'

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
  due_date?: Date
  notes: string
  contact_id: string
}

interface ICreateTaskResponse {
  message: string
  task_id: string
}

interface IUpdateTaskPayload {
  task_id: string
  title: string
  notes?: string
  due_date?: Date
  contact_id?: string
}

interface IUpdateTaskResponse {
  message: string
}

interface IDeleteTaskResponse {
  message: string
}

@Injectable({
  providedIn: 'root',
})
export class TasksService extends BaseService {

  public addTask(payload: ICreateTaskPayload) {
    const requestPayload = {
      ...payload,
      due_date: payload.due_date ? payload.due_date.getTime() : undefined, // Convert Date object into unix timestamp number.
    }
    return this.postRequest<ICreateTaskResponse>(`${this.apiUrl}/task`, requestPayload)
  }

  /**
   * Update an existing task.
   *
   * @param {IUpdateTaskPayload} payload
   */
  public updateTask(payload: IUpdateTaskPayload) {
    const requestPayload = {
      ...payload,
      due_date: payload.due_date ? payload.due_date.getTime() : undefined, // Convert Date object into unix timestamp number.
    }
    return this.putRequest<IUpdateTaskResponse>(`${this.apiUrl}/task`, requestPayload)
  }

  /**
   * Get a task, belonging to the user.
   *
   * @param {string} taskId
   */
  public getTask(taskId: string) {
    return this.getRequest<IGetTaskResponse>(`${this.apiUrl}/task`, { task_id: taskId })
  }

  /**
   * Get tasks list.
   *
   * @param {string} [contactId]
   */
  public getTasks(contactId = '') {
    return this.getRequest<IGetTasksResponse>(`${this.apiUrl}/tasks`, { contact_id: contactId })
  }

  /**
   * Delete a task, belonging to the user.
   *
   * @param {string} [contactId]
   */
  public deleteTask(taskId: string) {
    return this.deleteRequest<IDeleteTaskResponse>(`${this.apiUrl}/task`, { task_id: taskId })
  }
}
