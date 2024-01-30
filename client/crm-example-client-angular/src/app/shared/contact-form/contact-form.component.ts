import { Component, Input, OnInit, inject } from '@angular/core'
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { IGetContact } from '../../core/contacts.service'
import { AuthService } from '../../core/auth.service'

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
  private authService = inject(AuthService)
  private formBuilder = inject(FormBuilder)

  @Input() existingContact: IGetContact = {} as IGetContact

  public form = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email, Validators.pattern(this.authService.EMAIL_REGEXP)]],
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
