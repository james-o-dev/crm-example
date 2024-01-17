import { Injectable, inject } from '@angular/core'
import { from } from 'rxjs'
import { addTaskEndpoint, deleteTaskEndpoint, getTaskEndpoint, getTasksEndpoint, updateTaskEndpoint } from '../../assets/js/mock/tasks.mock'
import { AuthService } from './auth.service'

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

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private authService = inject(AuthService)

  addTask(payload: ITaskAdd) {
    if (typeof payload?.due_date === 'string' || typeof payload?.due_date === 'object') {
      payload.due_date = new Date(payload.due_date).getTime()
    }
    return from(addTaskEndpoint(this.authService.accessToken, payload))
  }

  updateTask(payload: ITaskUpdate) {
    if (typeof payload?.due_date === 'string' || typeof payload?.due_date === 'object') {
      payload.due_date = new Date(payload.due_date).getTime()
    }

    return from(updateTaskEndpoint(this.authService.accessToken, payload))
  }

  getTask(taskId: string) {
    return from(getTaskEndpoint(this.authService.accessToken, taskId))
  }

  getTasks(contactId?: string) {
    return from(getTasksEndpoint(this.authService.accessToken, contactId))
  }

  deleteTask(taskId: string) {
    return from(deleteTaskEndpoint(this.authService.accessToken, taskId))
  }
}
