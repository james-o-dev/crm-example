import { Component, OnInit, inject } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatMenuModule } from '@angular/material/menu'
import { RouterLink } from '@angular/router'
import { MatCardModule } from '@angular/material/card'
import { HomeService, IHomeMetadata } from './home.service'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    RouterLink,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private homeService = inject(HomeService)

  protected data: IHomeMetadata = {} as IHomeMetadata

  ngOnInit(): void {
    this.homeService.getHomeMetadata()
      .subscribe(response => this.data = response.data as IHomeMetadata)
  }
}
