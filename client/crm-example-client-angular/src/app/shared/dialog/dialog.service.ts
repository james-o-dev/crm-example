import { Injectable, inject } from '@angular/core'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { DialogComponent, IDialogAction, IDialogData } from './dialog.component'

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private dialog = inject(MatDialog)

  /**
   * Helper: Display dialog
   *
   * @param {string} title
   * @param {string[]} contents
   * @param {IDialogAction[]} actions
   * @param {MatDialogConfig} dialogConfig
   */
  public displayDialog(title: string, contents: string[], actions: IDialogAction[], dialogConfig?: MatDialogConfig) {
    const data: IDialogData = { title, contents, actions }
    return this.dialog.open(DialogComponent, { data, ...dialogConfig }).afterClosed()
  }

  /**
   * Display a generic error message dialog
   *
   * @param {string} errorMessage
   * @param {MatDialogConfig} dialogConfig
   */
  public displayErrorDialog(errorMessage: string, dialogConfig?: MatDialogConfig) {
    const message = errorMessage || 'An error has occurred. Please try again later.'
    return this.displayDialog('Error', [message], [{ text: 'Dismiss' }], dialogConfig)
  }
}
