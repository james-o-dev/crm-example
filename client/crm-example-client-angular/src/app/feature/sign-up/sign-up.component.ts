import { AuthService } from './../../core/auth.service'
import { Component, OnInit, inject } from '@angular/core'

import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { MatDialog } from '@angular/material/dialog'
import { DialogComponent, IDialogData } from '../../shared/dialog/dialog.component'

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
  private dialog = inject(MatDialog)
  private formBuilder = inject(FormBuilder)
  private router = inject(Router)

  protected form: UntypedFormGroup = new UntypedFormGroup({})

  public ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.compose([Validators.required])], // Disabled for now.
      confirmPassword: ['', Validators.compose([Validators.required, this.matchFieldValidator('password')])], // Disabled for now.
    })

  }

  private matchFieldValidator(fieldToMatch: string) {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const controlToMatch = control.parent?.get(fieldToMatch)
      return controlToMatch && controlToMatch.value !== control.value ? { 'fieldMismatch': true } : null
    }
  }

  protected onSubmit() {
    this.authService.signUp(this.form.value.email, this.form.value.password, this.form.value.confirmPassword)
      .subscribe({
        next: () => {
          this.router.navigate(['/home'])
        },
        error: (response) => {
          this.dialog.open(DialogComponent, {
            data: {
              contents: [response.error.message],
              actions: [{ text: 'Confirm' }],
            } as IDialogData,
          })
        },
      })
  }
}
