import { Component } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core'
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent {

  form: UntypedFormGroup = this.formBuilder.group({
    contact_id: '',
    title: ['', Validators.required],
    due_date: '',
    notes: '',
  })

  constructor(
    private formBuilder: FormBuilder,
  ) {}

  onReset() {
    this.form.reset(undefined)
  }
}
