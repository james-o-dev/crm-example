import { Component, inject } from '@angular/core'
import { LayoutComponent } from '../../shared/layout/layout.component'
import { MatButtonModule } from '@angular/material/button'
import { MatDividerModule } from '@angular/material/divider'
import { ImportExportService } from './import-export.service'
import { MatIconModule } from '@angular/material/icon'
import { from, switchMap } from 'rxjs'
import { Router } from '@angular/router'
import { MatDialog } from '@angular/material/dialog'
import { DialogComponent, IDialogData } from '../../shared/dialog/dialog.component'

@Component({
  selector: 'app-import-export',
  standalone: true,
  imports: [
    MatDividerModule,
    MatIconModule,
    LayoutComponent,
    MatButtonModule,
  ],
  templateUrl: './import-export.component.html',
  styleUrl: './import-export.component.css',
})
export class ImportExportComponent {
  private dialog = inject(MatDialog)
  private importExportService = inject(ImportExportService)
  private router = inject(Router)

  protected onImportJsonFileInput(event: Event) {
    const target = event.target as HTMLInputElement
    const files = target.files as FileList
    const file = files[0] ?? null

    if (!file) return

    from(this.parseJsonFile(file))
      .pipe(
        switchMap((fileData: string) => {
          return this.importExportService.importContactsJson(fileData)
        }),
      )
      .subscribe(response => {
        if (response.statusCode === 200) {
          this.dialog.open(DialogComponent, {
            data: {
              contents: [response.message],
              actions: [{ text: 'Confirm' }],
            } as IDialogData,
          }).afterClosed().subscribe(() => this.router.navigate(['/contacts']))
        } else {
          this.dialog.open(DialogComponent, {
            data: {
              contents: [response.message],
              actions: [{ text: 'Confirm' }],
            } as IDialogData,
          })
        }
      })
  }

  protected onExportJson() {
    this.importExportService.exportContactsJson()
      .subscribe(data => {
        // In development, download Json data as JSON file.
        this.saveAsFile(data.json as string)
      })
  }

  private saveAsFile(data: string) {
    const blob = new Blob([data])
    const link = document.createElement('a')
    link.download = `contacts-${Date.now()}.json`
    link.href = window.URL.createObjectURL(blob)
    link.click()
    link.remove()
  }

  private async parseJsonFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.onload = event => resolve(event.target?.result as string)
      fileReader.onerror = error => reject(error)
      fileReader.readAsText(file)
    })
  }
}
