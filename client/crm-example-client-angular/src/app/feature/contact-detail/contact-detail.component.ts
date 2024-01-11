import { Component, OnInit, ViewChild, inject } from '@angular/core'
import { LayoutComponent } from '../../shared/layout/layout.component'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { ContactService, IContact } from '../../core/contacts.service'
import { ActivatedRoute } from '@angular/router'
import { DatePipe } from '@angular/common'
import { ContactFormComponent } from '../../shared/contact-form/contact-form.component'
import { switchMap, tap } from 'rxjs'
import { LineBreakPipe } from '../../shared/line-break.pipe'
import { MatDividerModule } from '@angular/material/divider'
import { TasksTableComponent } from '../../shared/tasks-table/tasks-table.component'

@Component({
  selector: 'app-contact-detail',
  standalone: true,
  imports: [
    ContactFormComponent,
    DatePipe,
    LayoutComponent,
    LineBreakPipe,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    TasksTableComponent,
  ],
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.css',
})
export class ContactDetailComponent implements OnInit {
  @ViewChild(ContactFormComponent) contactForm: ContactFormComponent = {} as ContactFormComponent

  private activatedRoute = inject(ActivatedRoute)
  private contactService = inject(ContactService)

  protected contactId = ''
  protected contact: IContact = {} as IContact
  protected editMode = false

  public ngOnInit(): void {
    this.contactId = this.activatedRoute.snapshot.params['contactId']

    if (!this.contactId) return

    this.getContact().subscribe()
  }

  protected onSave() {
    this.contactService.updateContact({ ...this.contactForm.form.value, key: this.contactId } as IContact)
      .pipe(switchMap(() => this.getContact()))
      .subscribe({
        next: () => this.editMode = false,
      })
  }

  private getContact() {
    return this.contactService.getContact(this.contactId)
      .pipe(tap(data => this.contact = data.contact))
  }
}
