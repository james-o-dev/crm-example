import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterOutlet } from '@angular/router'
import { clearLocalStorageDb } from './core/mock/mock'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    RouterOutlet,
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {

  onLocalDbClear() {
    clearLocalStorageDb()
  }
}
