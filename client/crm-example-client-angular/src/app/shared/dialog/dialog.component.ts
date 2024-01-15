import { Component, Inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog'

export interface IDialogData {
  title?: string
  contents?: string[]
  actions?: {
    value?: boolean | string | object
    text: string
  }[]
}

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
})
export class DialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: IDialogData,
  ) {}
}
