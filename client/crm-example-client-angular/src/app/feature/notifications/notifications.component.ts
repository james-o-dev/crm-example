import { Component, OnInit, inject } from '@angular/core'
import { LayoutComponent } from '../../shared/layout/layout.component'
import { MatTableModule } from '@angular/material/table'
import { INotificationDetail, NotificationsService } from '../../core/notifications.service'
import { map } from 'rxjs/operators'
import { Router } from '@angular/router'
import { MatButtonModule } from '@angular/material/button'

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    LayoutComponent,
    MatButtonModule,
    MatTableModule,
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent implements OnInit {
  private notificationsService = inject(NotificationsService)
  private router = inject(Router)

  // Table data source.
  protected dataSource: INotificationDetail[] = []

  // Define the table columns.
  protected readonly COLUMNS = [
    'title',
    'message',
  ]

  public ngOnInit(): void {
    // On load, get the data.
    this.notificationsService.getNotificationsDetails()
      .pipe(
        map(response => response.details || []),
      ).subscribe(data => {
        this.dataSource = data as INotificationDetail[]
      })
  }

  /**
   * Handle click event when a button is used in a table row.
   * * It should redirect to the corresponding record.
   *
   * @param {INotificationDetail} element
   */
  protected handleTitleClick(element: INotificationDetail) {
    switch (element.type) {
      case 'task_soon':
      case 'task_overdue':
        this.router.navigate(['/task-detail', element.key])
        break

      default:
        break
    }
  }
}
