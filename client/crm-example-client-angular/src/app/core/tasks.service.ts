import { Injectable, inject } from '@angular/core'
import { from } from 'rxjs'
import { addTaskEndpoint, getTasksEndpoint } from './mock/tasks.mock'
import { AuthService } from './auth.service'

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private authService = inject(AuthService)

  addTask(payload: object) {
    return from(addTaskEndpoint(this.authService.accessToken, payload))
  }

  updateTask() {

  }

  getTask() {

  }

  getTasks(contactId?: string) {
    return from(getTasksEndpoint(this.authService.accessToken, contactId))
  }
}
