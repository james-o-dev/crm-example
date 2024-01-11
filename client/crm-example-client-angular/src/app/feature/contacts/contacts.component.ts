import { Component, OnInit } from '@angular/core'
import { ContactService } from '../../core/contacts.service'
import { LayoutComponent } from '../../shared/layout/layout.component'
import { MatTableModule } from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    LayoutComponent,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css',
})
export class ContactsComponent implements OnInit {
  readonly COLUMNS = ['name', 'contact-details', 'tasks']

  dataSource = [] as object[]

  constructor(
    private contactService: ContactService,
  ) { }

  ngOnInit(): void {
    this.loadData()
  }

  loadData() {
    this.contactService.getContacts()
      .subscribe(data => {
        this.dataSource = data.contacts as object[]
      })
  }
}
