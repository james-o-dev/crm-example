import { MatIconModule } from '@angular/material/icon'
import { Component, inject } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatListModule } from '@angular/material/list'
import { MatDividerModule } from '@angular/material/divider'
import { RouterLink } from '@angular/router'
import { AuthService } from '../../core/auth.service'

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterLink,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  private authService = inject(AuthService)

  protected onSignOut() {
    this.authService.signOut()
  }
}
