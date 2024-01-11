import { Component, ViewChild } from '@angular/core'
import { LayoutComponent } from '../../shared/layout/layout.component'
import { ContactFormComponent } from '../../shared/contact-form/contact-form.component'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { ContactService } from '../../core/contacts.service'

@Component({
  selector: 'app-add-contact',
  standalone: true,
  imports: [
    LayoutComponent,
    ContactFormComponent,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './add-contact.component.html',
  styleUrl: './add-contact.component.css',
})
export class AddContactComponent {
  @ViewChild('contactForm') contactForm: ContactFormComponent = {} as ContactFormComponent

  constructor(
    private contactService: ContactService,
  ) {}

  onSubmit() {
    if (this.contactForm.form.invalid) return

    this.contactService.newContact({
      name: this.contactForm.form.value.name as string,
      email: this.contactForm.form.value.email as string,
      phone: this.contactForm.form.value.phone as string,
      notes: this.contactForm.form.value.notes as string,
    }).subscribe({
      next: () => {
        alert('New contact added!') // TODO
        this.contactForm.form.reset()
      },
      error: (err) => {
        console.error(err)
      },
    })
  }
}
