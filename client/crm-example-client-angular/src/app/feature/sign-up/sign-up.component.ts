import { AuthService } from './../../core/auth.service'
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core'

import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { DialogService } from '../../shared/dialog/dialog.service'
import { matchFieldValidator } from '../../shared/common-functions'
import { MatIconModule } from '@angular/material/icon'

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent implements OnInit {
  protected authService = inject(AuthService)
  private dialog = inject(DialogService)
  private formBuilder = inject(FormBuilder)
  private router = inject(Router)

  protected form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email, Validators.pattern(this.authService.EMAIL_REGEXP)]],
    password: ['', [Validators.required, Validators.pattern(this.authService.PASSWORD_REGEXP)]],
    confirmPassword: ['', [Validators.required, matchFieldValidator('password')]],
  })

  public ngOnInit(): void {
    // Every time password is changed, update whether confirmPassword is still valid.
    this.form.controls.password.statusChanges.subscribe(() => this.form.controls.confirmPassword.updateValueAndValidity())
  }

  protected onSubmit() {
    const { email, password, confirmPassword } = this.form.value

    this.authService.signUp(email as string, password as string, confirmPassword as string)
      .subscribe({
        next: () => this.router.navigate(['/home']),
        error: (response) => this.dialog.displayErrorDialog(response.error.message),
      })
  }
}
