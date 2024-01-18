import { Component, ViewChild, inject } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'
import { TaskFormComponent } from '../../shared/task-form/task-form.component'
import { MatButtonModule } from '@angular/material/button'
import { TasksService } from '../../core/tasks.service'
import { MatDialog } from '@angular/material/dialog'
import { DialogComponent, IDialogData } from '../../shared/dialog/dialog.component'
import { Router } from '@angular/router'

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
  private dialog = inject(MatDialog)
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
        next: (res) => {
          if (res.statusCode === 201) {
            this.dialog.open(DialogComponent, {
              data: {
                title: 'Task added',
                contents: ['Would you like to go to the Tasks list?'],
                actions: [
                  { value: true, text: 'Yes, take me to the Tasks list' },
                  { text: 'No, stay on this form' },
                ],
              } as IDialogData,
            }).afterClosed().subscribe(confirmRedirect => {
              if (confirmRedirect) this.router.navigate(['/tasks'])
              else this.taskForm.onReset()
            })

          } else {
            this.dialog.open(DialogComponent, {
              data: {
                title: 'Error / invalid',
                contents: [res.message],
                actions: [{ text: 'Confirm' }],
              } as IDialogData,
            })
          }
        },
      })
  }
}
