import { Component, inject } from '@angular/core'
import { LayoutComponent } from '../../shared/layout/layout.component'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatTableModule } from '@angular/material/table'
import { RouterLink } from '@angular/router'
import { TasksService } from '../../core/tasks.service'
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    DatePipe,
    LayoutComponent,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    RouterLink,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent {
  private tasksService = inject(TasksService)

  protected readonly COLUMNS = ['title', 'due_date', 'contact']

  protected dataSource = [] as object[]

  public ngOnInit(): void {
    this.loadData()
  }

  private loadData() {
    this.tasksService.getTasks()
      .subscribe(data => {
        this.dataSource = data.tasks as object[]
      })
  }
}
