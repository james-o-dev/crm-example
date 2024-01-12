import { AsyncPipe } from '@angular/common'
import { Component, Input, OnInit, inject } from '@angular/core'
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatButtonModule } from '@angular/material/button'
import { MatNativeDateModule } from '@angular/material/core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { Observable, map, of, startWith } from 'rxjs'
import { ContactService, IContact } from '../../core/contacts.service'
import { ITask } from '../../core/tasks.service'
import { RouterLink } from '@angular/router'

interface IOption {
  value: string;
  text: string;
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent implements OnInit {
  private contactService = inject(ContactService)
  private formBuilder = inject(FormBuilder)

  @Input() existingTask: ITask = {} as ITask

  private contacts: IOption[] = []
  protected autoContacts: Observable<IOption[]> = of([])

  public form: UntypedFormGroup = this.formBuilder.group({
    autoContact: null,
    title: ['', Validators.required],
    due_date: '',
    notes: '',
  })

  public ngOnInit(): void {
    // Get contacts for the auto-complete.
    this.contactService.getContacts()
      .subscribe(data => {
        this.contacts = (data.contacts as IContact[])
          .map((contact) => {
            return {
              value: contact.key as string,
              text: contact.name,
            }
          })
      })


    // Autocomplete observable listener.
    this.autoContacts = this.form.controls['autoContact'].valueChanges.pipe(
      startWith(this.existingTask.contact_name || ''),
      map((value) => {
        if (!value) return []
        const text = typeof value === 'string' ? value : value?.text
        const normalText = text.trim().toLowerCase()
        return this.contacts.filter((contact) => contact.text.toLowerCase().includes(normalText))
      }),
    )

    this.onReset()
  }

  public onReset() {
    this.form.reset(this.existingTask || undefined)
  }

  protected autoDisplayFn(option: IOption): string {
    return option && option.text ? option.text : ''
  }
}
