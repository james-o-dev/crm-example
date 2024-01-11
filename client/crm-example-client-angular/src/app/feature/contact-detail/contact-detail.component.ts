import { Component, OnInit, ViewChild } from '@angular/core'
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
  ],
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.css',
})
export class ContactDetailComponent implements OnInit {
  @ViewChild(ContactFormComponent) contactForm: ContactFormComponent = {} as ContactFormComponent

  contactId = ''
  contact: IContact = {} as IContact
  editMode = false

  constructor(
    private activatedRoute: ActivatedRoute,
    private contactService: ContactService,
  ) { }

  ngOnInit(): void {
    this.contactId = this.activatedRoute.snapshot.params['contactId']

    if (!this.contactId) return

    this.getContact().subscribe()
  }

  onSave() {
    this.contactService.updateContact({ ...this.contactForm.form.value, key: this.contactId } as IContact)
      .pipe(switchMap(() => this.getContact()))
      .subscribe({
        next: () => this.editMode = false,
      })
  }

  getContact() {
    return this.contactService.getContact(this.contactId)
      .pipe(tap(data => this.contact = data.contact))
  }
}
