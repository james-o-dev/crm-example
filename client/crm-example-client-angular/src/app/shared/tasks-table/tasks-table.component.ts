import { DatePipe } from '@angular/common'
import { Component, Input, inject } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatTableModule } from '@angular/material/table'
import { RouterLink } from '@angular/router'
import { LayoutComponent } from '../layout/layout.component'
import { TasksService } from '../../core/tasks.service'

@Component({
  selector: 'app-tasks-table',
  standalone: true,
  imports: [
    DatePipe,
    LayoutComponent,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    RouterLink,
  ],
  templateUrl: './tasks-table.component.html',
  styleUrl: './tasks-table.component.css',
})
export class TasksTableComponent {
  private tasksService = inject(TasksService)

  @Input() contactId = ''

  protected columns = ['title', 'due_date', 'contact']

  protected dataSource = [] as object[]

  public ngOnInit(): void {
    // Remove the redundant contact column if the contactId was provided.
    if (this.contactId) this.columns = this.columns.filter(c => c !== 'contact')

    this.loadData()
  }

  private loadData() {
    this.tasksService.getTasks(this.contactId)
      .subscribe(data => {
        this.dataSource = data.tasks as object[]
      })
  }
}
