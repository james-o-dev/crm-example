import { ITask, ITaskUpdate, TasksService } from './../../core/tasks.service'
import { Component, OnInit, ViewChild, inject } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { LineBreakPipe } from '../../shared/line-break.pipe'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { TaskFormComponent } from '../../shared/task-form/task-form.component'
import { of, switchMap, tap } from 'rxjs'
import { MatDialog } from '@angular/material/dialog'
import { DialogComponent, IDialogData } from '../../shared/dialog/dialog.component'
import { DateFnsPipe } from '../../shared/date-fns.pipe'
import { NotificationsService } from '../../core/notifications.service'

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    DateFnsPipe,
    LineBreakPipe,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    RouterLink,
    TaskFormComponent,
  ],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.css',
})
export class TaskDetailComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute)
  private dialog = inject(MatDialog)
  private notificationsService = inject(NotificationsService)
  private router = inject(Router)
  private tasksService = inject(TasksService)

  @ViewChild(TaskFormComponent) taskForm: TaskFormComponent = {} as TaskFormComponent

  protected editMode = false
  protected taskId = ''
  protected task: ITask = {} as ITask

  public ngOnInit(): void {
    this.taskId = this.activatedRoute.snapshot.params['taskId']

    if (!this.taskId) return

    this.getTask().subscribe()
  }

  protected onSave() {
    const payload: ITaskUpdate = {
      title: this.taskForm.form.value.title,
      key: this.taskId,
      notes: this.taskForm.form.value.notes,
      due_date: this.taskForm.form.value.due_date,
    }

    this.tasksService.updateTask(payload)
      .pipe(
        switchMap(() => this.getTask()),
      )
      .subscribe({
        next: () => {
          this.notificationsService.triggerNumberUpdateEvent()
          this.editMode = false
        },
      })
  }

  private getTask() {
    return this.tasksService.getTask(this.taskId)
      .pipe(tap((response) => this.task = response.task as ITask))
  }

  protected deleteTask() {

    this.dialog.open(DialogComponent, { data: {
      title: 'Confirm Delete Task',
      contents: [
        'Are you sure you want to delete this task?',
        'This is irreversible.',
      ],
      actions: [
        { text: 'Cancel' },
        { value: true, text: 'Delete Confirmed' },
      ],
    } as IDialogData })
    .afterClosed()
    .pipe(
      switchMap(confirmed => confirmed ? this.tasksService.deleteTask(this.taskId) : of(null)),
      switchMap(response => {
        if (response?.statusCode === 200) {
          this.notificationsService.triggerNumberUpdateEvent()

          return this.dialog.open(DialogComponent, { data: {
            title: 'Task Deleted',
            actions: [{ value: true, text: 'Confirm' }],
          } as IDialogData }).afterClosed()
        }
        return of(null)
      }),
    ).subscribe(confirmed => confirmed ? this.router.navigate(['/tasks']) : null)
  }
}
