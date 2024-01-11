import { Component, ViewChild } from '@angular/core'
import { LayoutComponent } from '../../shared/layout/layout.component'
import { MatIconModule } from '@angular/material/icon'
import { TaskFormComponent } from '../../shared/task-form/task-form.component'
import { MatButtonModule } from '@angular/material/button'
import { TasksService } from '../../core/tasks.service'

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    LayoutComponent,
    MatButtonModule,
    MatIconModule,
    TaskFormComponent,
  ],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css',
})
export class AddTaskComponent {
  @ViewChild('taskForm') taskForm = {} as TaskFormComponent

  constructor(
    private tasksService: TasksService,
  ) {}

  onSubmit() {
    if (this.taskForm.form.invalid) return

    this.tasksService.addTask(this.taskForm.form.value)
      .subscribe({
        next: (res) => {
          console.log('res :>> ', res)
          if (res.statusCode === 201) {
            alert('Task added.') // TODO
            this.taskForm.onReset()
          } else {
            // TODO: Was not successful.
          }
        },
      })
  }
}
