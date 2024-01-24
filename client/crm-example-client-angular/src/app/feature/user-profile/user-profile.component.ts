import { Component, OnInit, inject } from '@angular/core'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatDividerModule } from '@angular/material/divider'
import { MatButtonModule } from '@angular/material/button'
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { UserProfileService } from './user-profile.service'
import { MatIconModule } from '@angular/material/icon'
import { DialogService } from '../../shared/dialog/dialog.service'

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
    newPassword: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  })

  constructor(

  ) { }

  public ngOnInit() {
    this.changePasswordForm.disable()

    this.userProfileService.getUsername()
      .subscribe(data => {
        this.username = data.username
        this.changeUserNameForm.patchValue({ username: this.username })
      })
  }

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

  protected onChangePassword() {
    // TODO.
  }
}
