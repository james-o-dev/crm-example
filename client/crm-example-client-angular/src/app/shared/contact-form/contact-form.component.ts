import { Component, Input, OnInit } from '@angular/core'
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { IContact } from '../../core/contacts.service'

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
export class ContactFormComponent implements OnInit {
  @Input() existingContact: IContact = {} as IContact

  form = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.email],
    phone: [''],
    notes: [''],
  })

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.onReset()
  }

  onReset() {
    if (this.existingContact) {
      this.form.reset(this.existingContact)
    }
  }
}
