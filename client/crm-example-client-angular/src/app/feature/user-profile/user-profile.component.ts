import { Component, OnInit } from '@angular/core'
import { LayoutComponent } from '../../shared/layout/layout.component'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatDividerModule } from '@angular/material/divider'
import { MatButtonModule } from '@angular/material/button'
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { UserProfileService } from './user-profile.service'

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    LayoutComponent,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
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
        this.changeUserNameForm.patchValue({ username: data.username })
      })
  }

  onChangeUsername() {
    this.userProfileService.setUsername(this.changeUserNameForm.value.username as string)
  }

  onChangePassword() {
    // TODO.
  }
}
