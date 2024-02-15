import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core'
import { ContactService, IGetContacts } from '../../core/contacts.service'
import { MatTableModule } from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { RouterLink } from '@angular/router'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTableModule,
    RouterLink,
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsComponent implements OnInit {
  private contactService = inject(ContactService)

  protected readonly COLUMNS = ['name', 'contact-details', 'tasks']

  protected activeToggle = true
  protected dataSource = signal<IGetContacts[]>([])

  public ngOnInit(): void {
    this.loadData()
  }

  private loadData() {
    this.contactService.getContacts(this.activeToggle)
      .subscribe(data => {
        this.dataSource.set(data.contacts)
      })
  }

  protected onActiveToggleChange() {
    this.activeToggle = !this.activeToggle
    this.loadData()
  }
}
