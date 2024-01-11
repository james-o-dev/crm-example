import { Component, inject } from '@angular/core'
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { AuthService } from '../../core/auth.service'
import { Router, RouterLink } from '@angular/router'

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent {
  private authService = inject(AuthService)
  private formBuilder = inject(FormBuilder)
  private router = inject(Router)

  protected form: UntypedFormGroup = new UntypedFormGroup({})

  public ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['' /**Validators.required */], // Disabled for now.
    })

    // Dev purposes, password is not required.
    this.form.get('password')?.disable()
  }

  protected onSubmit() {
    this.authService.signIn(this.form.value.email)
      .subscribe({
        next: (response) => {
          if (response.statusCode === 200) {
            this.router.navigate(['/home'])
          } else {
            alert(response.message) // TODO Replace.
          }
        },
      })
  }
}
