import { Component, ViewChild, inject } from '@angular/core'
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
  private tasksService = inject(TasksService)

  @ViewChild('taskForm') taskForm = {} as TaskFormComponent

  protected onSubmit() {
    if (this.taskForm.form.invalid) return

    const formValue = this.taskForm.form.value

    const payload = {
      title: formValue.title,
      due_date: formValue.due_date,
      notes: formValue.notes,
      contact_id: formValue.autoContact?.value,
    }

    this.tasksService.addTask(payload)
      .subscribe({
        next: (res) => {
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
