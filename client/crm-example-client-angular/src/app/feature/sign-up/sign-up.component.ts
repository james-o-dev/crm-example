import { AuthService } from './../../core/auth.service'
import { Component, OnInit } from '@angular/core'

import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent implements OnInit {

  form: UntypedFormGroup = new UntypedFormGroup({})

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['' /**Validators.required */], // Disabled for now.
      confirmPassword: ['' /**Validators.required */], // Disabled for now.
    })

    // Dev purposes, password is not required.
    this.form.get('password')?.disable()
    this.form.get('confirmPassword')?.disable()
  }

  onSubmit() {
    this.authService.signUp(this.form.value.email)
      .subscribe({
        next: (response) => {
          console.log('response :>> ', response)
          if (response.status === 201) {
            // TODO redirect.
          } else {
            alert(response.message) // TODO Replace.
          }
        },
      })
  }
}
