import { Component, ViewChild, inject } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'
import { TaskFormComponent } from '../../shared/task-form/task-form.component'
import { MatButtonModule } from '@angular/material/button'
import { TasksService } from '../../core/tasks.service'
import { Router } from '@angular/router'
import { NotificationsService } from '../../core/notifications.service'
import { DialogService } from '../../shared/dialog/dialog.service'

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    TaskFormComponent,
  ],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css',
})
export class AddTaskComponent {
  private dialog = inject(DialogService)
  private notificationsService = inject(NotificationsService)
  private router = inject(Router)
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
        next: () => {
          // Display dialog on success - ask to redirect to task list.
          this.dialog.displayDialog('Task added', ['Would you like to go to the Tasks list?'],
            [
              { value: true, text: 'Yes, take me to the Tasks list' },
              { text: 'No, stay on this form' },
            ],
          ).subscribe(confirmRedirect => {
            this.notificationsService.triggerNumberUpdateEvent()
            // Redirect.
            if (confirmRedirect) this.router.navigate(['/tasks'])
            // Stay on form and reset it.
            else this.taskForm.onReset()
          })
        },
        error: (response) => this.dialog.displayErrorDialog(response.error.message),
      })
  }
}
