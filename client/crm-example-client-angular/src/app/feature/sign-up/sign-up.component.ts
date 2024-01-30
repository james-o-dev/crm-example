import { AuthService } from './../../core/auth.service'
import { Component, OnInit, inject } from '@angular/core'

import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { DialogService } from '../../shared/dialog/dialog.service'
import { matchFieldValidator } from '../../shared/common-functions'

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
  private dialog = inject(DialogService)
  private formBuilder = inject(FormBuilder)
  private router = inject(Router)

  protected form: UntypedFormGroup = new UntypedFormGroup({})

  public ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required, matchFieldValidator('password')]],
    })
  }

  protected onSubmit() {
    this.authService.signUp(this.form.value.email, this.form.value.password, this.form.value.confirmPassword)
      .subscribe({
        next: () => this.router.navigate(['/home']),
        error: (response) => this.dialog.displayErrorDialog(response.error.message),
      })
  }
}
