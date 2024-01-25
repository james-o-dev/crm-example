import { Component, Input, OnInit, inject } from '@angular/core'
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
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css',
})
export class ContactFormComponent implements OnInit {
  private formBuilder = inject(FormBuilder)

  @Input() existingContact: IContact = {} as IContact

  form = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    notes: [''],
  })

  public ngOnInit(): void {
    this.onReset()
  }

  protected onReset() {
    this.form.reset(this.existingContact || undefined)
  }
}
