import { ChangeDetectionStrategy, Component, Input, inject, signal } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatTableModule } from '@angular/material/table'
import { RouterLink } from '@angular/router'
import { IGetTasks, TasksService } from '../../core/tasks.service'
import { DateFnsPipe } from '../date-fns.pipe'

@Component({
  selector: 'app-tasks-table',
  standalone: true,
  imports: [
    DateFnsPipe,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    RouterLink,
  ],
  templateUrl: './tasks-table.component.html',
  styleUrl: './tasks-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksTableComponent {
  private tasksService = inject(TasksService)

  @Input() contactId = ''

  protected columns = ['title', 'due_date', 'contact']

  protected dataSource = signal<IGetTasks[]>([] as IGetTasks[])

  public ngOnInit(): void {
    // Remove the redundant contact column if the contactId was provided.
    if (this.contactId) this.columns = this.columns.filter(c => c !== 'contact')

    this.loadData()
  }

  private loadData() {
    this.tasksService.getTasks(this.contactId)
      .subscribe(data => {
        this.dataSource.set(data.tasks)
      })
  }
}
