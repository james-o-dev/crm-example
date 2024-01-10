import { Component, OnInit } from '@angular/core'
import { LayoutComponent } from '../../shared/layout/layout.component'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatDividerModule } from '@angular/material/divider'
import { MatButtonModule } from '@angular/material/button'
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'

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

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.changePasswordForm.disable()
  }

  onChangeUsername() {
    console.log('test')
  }

  onChangePassword() {
    // TODO.
  }
}
