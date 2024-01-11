import { AuthService } from './../../core/auth.service'
import { Component, OnInit, inject } from '@angular/core'

import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent implements OnInit {
  private authService = inject(AuthService)
  private formBuilder = inject(FormBuilder)
  private router = inject(Router)

  protected form: UntypedFormGroup = new UntypedFormGroup({})

  public ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['' /**Validators.required */], // Disabled for now.
      confirmPassword: ['' /**Validators.required */], // Disabled for now.
    })

    // Dev purposes, password is not required.
    this.form.get('password')?.disable()
    this.form.get('confirmPassword')?.disable()
  }

  protected onSubmit() {
    this.authService.signUp(this.form.value.email)
      .subscribe({
        next: (response) => {
          if (response.statusCode === 201) {
            this.router.navigate(['/home'])
          } else {
            alert(response.message) // TODO Replace.
          }
        },
      })
  }
}
