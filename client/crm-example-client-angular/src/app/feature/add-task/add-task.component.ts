import { Component, ViewChild, inject } from '@angular/core'
import { LayoutComponent } from '../../shared/layout/layout.component'
import { MatIconModule } from '@angular/material/icon'
import { TaskFormComponent } from '../../shared/task-form/task-form.component'
import { MatButtonModule } from '@angular/material/button'
import { TasksService } from '../../core/tasks.service'
import { MatDialog } from '@angular/material/dialog'
import { DialogComponent, IDialogData } from '../../shared/dialog/dialog.component'

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
  private dialog = inject(MatDialog)
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
                actions: [{ text: 'Confirm' }],
              } as IDialogData,
            }).afterClosed().subscribe(() => this.taskForm.onReset())

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
