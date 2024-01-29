import { Component, inject } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatMenuModule } from '@angular/material/menu'
import { RouterLink } from '@angular/router'
import { MatCardModule } from '@angular/material/card'
import { HomeService } from './home.service'
import { map } from 'rxjs'
import { AsyncPipe, NgIf } from '@angular/common'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    NgIf,
    RouterLink,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private homeService = inject(HomeService)

  protected data$ = this.homeService.getHomeMetadata()
    .pipe(map(response => response.data))
}
