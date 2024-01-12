import { Injectable, inject } from '@angular/core'
import { from } from 'rxjs'
import { addTaskEndpoint, getTaskEndpoint, getTasksEndpoint, updateTaskEndpoint } from './mock/tasks.mock'
import { AuthService } from './auth.service'

export interface ITask {
  contact_id?: string
  contact_name?: string
  date_created: number
  date_modified: number
  due_date?: string
  key: string
  notes?: string
  title: string
  user_id: string
}

export interface ITaskUpdate {
  due_date?: string
  key: string
  notes?: string
  title: string
}

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private authService = inject(AuthService)

  addTask(payload: object) {
    return from(addTaskEndpoint(this.authService.accessToken, payload))
  }

  updateTask(payload: ITaskUpdate) {
    return from(updateTaskEndpoint(this.authService.accessToken, payload))
  }

  getTask(taskId: string) {
    return from(getTaskEndpoint(this.authService.accessToken, taskId))
  }

  getTasks(contactId?: string) {
    return from(getTasksEndpoint(this.authService.accessToken, contactId))
  }
}
