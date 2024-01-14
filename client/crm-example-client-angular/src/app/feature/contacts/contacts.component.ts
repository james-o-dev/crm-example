import { Component, OnInit, inject } from '@angular/core'
import { ContactService } from '../../core/contacts.service'
import { LayoutComponent } from '../../shared/layout/layout.component'
import { MatTableModule } from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { RouterLink } from '@angular/router'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    LayoutComponent,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTableModule,
    RouterLink,
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css',
})
export class ContactsComponent implements OnInit {
  private contactService = inject(ContactService)

  protected readonly COLUMNS = ['name', 'contact-details', 'tasks']

  protected activeToggle = true
  protected dataSource = [] as object[]

  public ngOnInit(): void {
    this.loadData()
  }

  private loadData() {
    this.contactService.getContacts(this.activeToggle)
      .subscribe(data => {
        this.dataSource = data.contacts as object[]
      })
  }

  protected onActiveToggleChange() {
    this.activeToggle = !this.activeToggle
    this.loadData()
  }
}
