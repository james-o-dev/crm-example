import { ITask, ITaskUpdate, TasksService } from './../../core/tasks.service'
import { DatePipe } from '@angular/common'
import { Component, OnInit, ViewChild, inject } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { LayoutComponent } from '../../shared/layout/layout.component'
import { LineBreakPipe } from '../../shared/line-break.pipe'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { TaskFormComponent } from '../../shared/task-form/task-form.component'
import { switchMap, tap } from 'rxjs'

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    DatePipe,
    LayoutComponent,
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
        next: () => this.editMode = false,
      })
  }

  private getTask() {
    return this.tasksService.getTask(this.taskId)
      .pipe(tap((response) => this.task = response.task as ITask))
  }

  protected deleteTask() {
    if (!confirm('Are you sure you want to delete this task?\n This is irreversible.')) return

    this.tasksService.deleteTask(this.taskId)
      .subscribe(() => this.router.navigate(['/tasks']))
  }
}
