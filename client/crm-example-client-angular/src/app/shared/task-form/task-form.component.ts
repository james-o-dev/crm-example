import { AsyncPipe } from '@angular/common'
import { Component, OnInit, inject } from '@angular/core'
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatButtonModule } from '@angular/material/button'
import { MatNativeDateModule } from '@angular/material/core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { Observable, map, of, startWith } from 'rxjs'
import { ContactService } from '../../core/contacts.service'

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
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent implements OnInit {
  private contactService = inject(ContactService)
  private formBuilder = inject(FormBuilder)

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
        this.contacts = (data.contacts || []).map(({ key, name }) => ({ value: key as string, text: name as string }))
      })

    // Autocomplete observable listener.
    this.autoContacts = this.form.controls['autoContact'].valueChanges.pipe(
      startWith(''),
      map((value) => {
        if (!value) return []
        const text = typeof value === 'string' ? value : value?.text
        const normalText = text.trim().toLowerCase()
        return this.contacts.filter((contact) => contact.text.toLowerCase().includes(normalText))
      }),
    )
  }

  public onReset() {
    this.form.reset(undefined)
  }

  protected autoDisplayFn(option: IOption): string {
    return option && option.text ? option.text : ''
  }
}
