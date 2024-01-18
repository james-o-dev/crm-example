import { Component, OnInit, effect, inject } from '@angular/core'
import { AsyncPipe, CommonModule } from '@angular/common'
import { RouterLink, RouterOutlet } from '@angular/router'
import { clearLocalStorageDb } from '../assets/js/mock/mock.js'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field'
import { MAT_DATE_FNS_FORMATS, provideDateFnsAdapter } from '@angular/material-date-fns-adapter'
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { enNZ } from 'date-fns/locale'
import { MatDividerModule } from '@angular/material/divider'
import { MatBadgeModule } from '@angular/material/badge'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatSidenavModule } from '@angular/material/sidenav'
import { AuthService } from './core/auth.service.js'

import { Observable, map, of } from 'rxjs'
import { NotificationsService } from './core/notifications.service'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AsyncPipe,
    MatBadgeModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    RouterLink,

    CommonModule,
    // LayoutComponent,
    MatToolbarModule,
    RouterOutlet,
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
    provideDateFnsAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: enNZ },
    { provide: MAT_DATE_FORMATS, useValue: MAT_DATE_FNS_FORMATS },
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService)
  private notificationsService = inject(NotificationsService)

  onLocalDbClear() {
    clearLocalStorageDb()
  }

  protected hasAuthenticatedSignal = this.authService.hasAuthenticated

  // Define the notification number Observable.
  protected notificationNumber$: Observable<string> = of('')

  constructor() {
    /**
     * Using Angular Signals and effects.
     * * effect() must be in constructor
     * * Within the effect function, the signal must be present
     * * The new signal value must be different from the fold one.
     */
    effect(() => {
      this.notificationsService.updateNotificationNumberSignal()
      this.getNotificationCount()
    })
  }

  public ngOnInit(): void {
    this.getNotificationCount()
  }

  /**
   * Fetches the notification count.
   * * Call it again to update
   */
  private getNotificationCount() {
    this.notificationNumber$ = of('')

    // Define the notification number Observable.
    this.notificationNumber$ = this.notificationsService.getNotificationsNumberOnly()
      .pipe(
        map(response => response?.number || ''),
      )
  }

  protected onSignOut() {
    this.authService.signOut()
  }
}
