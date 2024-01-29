import { Component, ViewChild, inject } from '@angular/core'
import { ContactFormComponent } from '../../shared/contact-form/contact-form.component'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { ContactService } from '../../core/contacts.service'
import { Router } from '@angular/router'
import { DialogService } from '../../shared/dialog/dialog.service'

@Component({
  selector: 'app-add-contact',
  standalone: true,
  imports: [
    ContactFormComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './add-contact.component.html',
  styleUrl: './add-contact.component.css',
})
export class AddContactComponent {
  private contactService = inject(ContactService)
  private dialog = inject(DialogService)
  private router = inject(Router)

  @ViewChild('contactForm') contactForm: ContactFormComponent = {} as ContactFormComponent

  protected onSubmit() {
    if (this.contactForm.form.invalid) return

    this.contactService.newContact({
      name: this.contactForm.form.value.name as string,
      email: this.contactForm.form.value.email as string,
      phone: this.contactForm.form.value.phone as string,
      notes: this.contactForm.form.value.notes as string,
    }).subscribe({
      next: () => {
        const title = 'New contact added'
        const contents = ['Would you like to go to your existing contacts?']
        const actions = [
          { value: true, text: 'Yes, go to contacts list' },
          { text: 'No, stay on the form' },
        ]
        this.dialog.displayDialog(title, contents, actions)
          .subscribe((confirmed: boolean) => {
            if (confirmed) this.router.navigate(['/contacts'])
            else this.contactForm.form.reset()
          })
      },
      error: (response) => {
        this.dialog.displayErrorDialog(response.error.message)
      },
    })
  }
}
