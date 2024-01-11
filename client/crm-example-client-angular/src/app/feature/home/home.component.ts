import { Component } from '@angular/core'
import { LayoutComponent } from '../../shared/layout/layout.component'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatMenuModule } from '@angular/material/menu'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    LayoutComponent,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {

}
