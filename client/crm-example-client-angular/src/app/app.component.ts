import { Component, OnInit, ViewChild, effect, inject } from '@angular/core'
import { AsyncPipe, CommonModule } from '@angular/common'
import { RouterLink, RouterOutlet } from '@angular/router'
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
import { MatDrawer, MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav'
import { AuthService } from './core/auth.service.js'
import { BreakpointObserver } from '@angular/cdk/layout'
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
  private breakpointObserver = inject(BreakpointObserver)
  private notificationsService = inject(NotificationsService)

  @ViewChild('drawer') drawer: MatDrawer = {} as MatDrawer

  protected hasAuthenticatedSignal = this.authService.hasAuthenticated

  // Define the notification number Observable.
  protected notificationNumber$: Observable<string> = of('')

  protected sidenavOpened = false
  protected sidenavMode: MatDrawerMode = 'over'
  private responsiveMode = false

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

    // Breakpoint observables.
    this.breakpointObserver.observe(['(min-width: 769px)'])
      .subscribe((val) => {
        this.responsiveMode = !val.matches

        if (!this.responsiveMode) {
          this.sidenavOpened = true
          this.sidenavMode = 'side'
        } else {
          this.sidenavOpened = false
          this.sidenavMode = 'over'
        }
      })
  }

  /**
   * Fetches the notification count.
   * * Call it again to update
   */
  private getNotificationCount() {
    this.notificationNumber$ = of('')

    // Define the notification number Observable.
    this.notificationNumber$ = this.notificationsService.getNotificationsCount()
      .pipe(
        map(response => response?.count === '0' ? '' : response.count), // Do not display if it returned with '0' (i.e. no notifications).
      )
  }

  protected onSignOut() {
    this.authService.signOut()
  }

  /**
   * Handle closing the sidenav.
   * * Do not close it if it is in desktop mode (since it cannot be opened again).
   */
  protected closeSidenav() {
    if (this.responsiveMode) {
      this.drawer.close()
    }
  }
}
