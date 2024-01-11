import { Component, OnInit } from '@angular/core'
import { LayoutComponent } from '../../shared/layout/layout.component'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatDividerModule } from '@angular/material/divider'
import { MatButtonModule } from '@angular/material/button'
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { UserProfileService } from './user-profile.service'
import { MatIconModule } from '@angular/material/icon'

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    FormsModule,
    LayoutComponent,
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
  editModeUsername = false
  username = ''

  changeUserNameForm = this.formBuilder.group({
    username: [''],
  })

  changePasswordForm = this.formBuilder.group({
    oldPassword: ['', Validators.required],
    newPassword: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  })

  constructor(
    private userProfileService: UserProfileService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.changePasswordForm.disable()

    this.userProfileService.getUsername()
      .subscribe(data => {
        this.username = data.username
        this.changeUserNameForm.patchValue({ username: this.username })
      })
  }

  onChangeUsername() {
    this.userProfileService.setUsername(this.changeUserNameForm.value.username as string)
      .subscribe(() => {
        this.username = this.changeUserNameForm.value.username as string
        this.editModeUsername = false
      })
  }

  onChangePassword() {
    // TODO.
  }
}
