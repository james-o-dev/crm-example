import { Component, ViewChild, inject } from '@angular/core'
import { LayoutComponent } from '../../shared/layout/layout.component'
import { ContactFormComponent } from '../../shared/contact-form/contact-form.component'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { ContactService } from '../../core/contacts.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-add-contact',
  standalone: true,
  imports: [
    ContactFormComponent,
    LayoutComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './add-contact.component.html',
  styleUrl: './add-contact.component.css',
})
export class AddContactComponent {
  @ViewChild('contactForm') contactForm: ContactFormComponent = {} as ContactFormComponent
  private contactService = inject(ContactService)
  private router = inject(Router)

  protected onSubmit() {
    if (this.contactForm.form.invalid) return

    this.contactService.newContact({
      name: this.contactForm.form.value.name as string,
      email: this.contactForm.form.value.email as string,
      phone: this.contactForm.form.value.phone as string,
      notes: this.contactForm.form.value.notes as string,
    }).subscribe({
      next: () => {
        this.contactForm.form.reset()
        if (confirm('New contact added! Would you like to go to your existing contacts?')) {
          this.router.navigate(['/contacts'])
        }
      },
      error: (err) => {
        console.error(err)
      },
    })
  }
}
