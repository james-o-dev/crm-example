import { Component, OnInit, inject } from '@angular/core'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatDividerModule } from '@angular/material/divider'
import { MatButtonModule } from '@angular/material/button'
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { UserProfileService } from './user-profile.service'
import { MatIconModule } from '@angular/material/icon'
import { DialogService } from '../../shared/dialog/dialog.service'
import { map, of, switchMap } from 'rxjs'
import { AuthService } from '../../core/auth.service'
import { matchFieldValidator } from '../../shared/common-functions'

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  protected auth = inject(AuthService)
  private dialog = inject(DialogService)
  private formBuilder = inject(FormBuilder)
  private userProfileService = inject(UserProfileService)

  protected editModeUsername = false
  protected username = ''

  protected changeUserNameForm = this.formBuilder.group({
    username: [''],
  })

  protected changePasswordForm = this.formBuilder.group({
    oldPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.pattern(this.auth.PASSWORD_REGEXP)]],
    confirmPassword: ['', [Validators.required, matchFieldValidator('newPassword')]],
  })

  public ngOnInit() {
    this.userProfileService.getUsername()
      .subscribe(data => {
        this.username = data.username
        this.changeUserNameForm.patchValue({ username: this.username })
      })
  }

  /**
   * Make request to change the username.
   */
  protected onChangeUsername() {
    this.userProfileService.setUsername(this.changeUserNameForm.value.username as string)
      .subscribe({
        next: () => {
          this.username = this.changeUserNameForm.value.username as string
          this.editModeUsername = false
        },
        error: (response) => this.dialog.displayErrorDialog(response.error.message),
      })
  }

  /**
   * Make request to change the password.
   */
  protected onChangePassword() {
    if (this.changePasswordForm.invalid) return

    const { oldPassword, newPassword, confirmPassword } = this.changePasswordForm.value
    this.userProfileService.changePassword(oldPassword as string, newPassword as string, confirmPassword as string)
      .pipe(
        switchMap(() => this.dialog.displayDialog('Password changed successfully', ['You will be signed out.'], [{ text: 'OK' }])),
      )
      .subscribe({
        next: () => this.auth.signOut(),
        error: (response) => this.dialog.displayErrorDialog(response.error.message),
      })
  }

  /**
   * Confirm before signing out everywhere.
   */
  protected onSignOutEverywhere() {
    const title = 'Sign Out Everywhere?'
    const contents = ['This will sign you out of all existing devices']
    const actions = [
      { text: 'Cancel' },
      { text: 'Sign Out', value: true },
    ]

    this.dialog.displayDialog(title, contents, actions)
      .pipe(
        switchMap(confirmed => {
          // Make request to sign-out everywhere.
          if (confirmed) return this.userProfileService.signOutEverywhere()
          // Else, skipped.
          return of(null)
        }),
        switchMap(result => {
          // Display success dialog, return true.
          if (result) return this.dialog.displayDialog('Sign Out Successful', ['You will be signed out.'], [{ text: 'OK' }]).pipe(map(() => true))
          // Else, skipped.
          return of(null)
        }),
      )
      .subscribe({
        next: (data) => data ? this.auth.signOut() : null,
        error: (response) => this.dialog.displayErrorDialog(response.error.message),
      })



  }
}
