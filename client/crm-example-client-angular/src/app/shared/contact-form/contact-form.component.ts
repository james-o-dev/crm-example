import { Component, Input } from '@angular/core'
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css',
})
export class ContactFormComponent {
  @Input() existingContact = {}

  form = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.email],
    phone: [''],
    notes: [''],
  })

  constructor(
    private formBuilder: FormBuilder,
  ) {}
}
