import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { AuthService } from '../../core/auth.service'
import { Router, RouterLink } from '@angular/router'
import { DialogService } from '../../shared/dialog/dialog.service'

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent {
  private authService = inject(AuthService)
  private dialog = inject(DialogService)
  private formBuilder = inject(FormBuilder)
  private router = inject(Router)

  protected form: UntypedFormGroup = new UntypedFormGroup({})

  public ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    })
  }

  protected onSubmit() {
    this.authService.signIn(this.form.value.email, this.form.value.password)
      .subscribe({
        next: () => this.router.navigate(['/home']),
        error: (response) => this.dialog.displayErrorDialog(response.error.message),
      })
  }
}
