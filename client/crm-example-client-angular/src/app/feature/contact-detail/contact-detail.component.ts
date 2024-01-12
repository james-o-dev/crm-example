import { Component, OnInit, ViewChild, inject } from '@angular/core'
import { LayoutComponent } from '../../shared/layout/layout.component'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { ContactService, IContact } from '../../core/contacts.service'
import { ActivatedRoute } from '@angular/router'
import { DatePipe } from '@angular/common'
import { ContactFormComponent } from '../../shared/contact-form/contact-form.component'
import { switchMap, tap } from 'rxjs'
import { LineBreakPipe } from '../../shared/line-break.pipe'
import { MatDividerModule } from '@angular/material/divider'
import { TasksTableComponent } from '../../shared/tasks-table/tasks-table.component'
import { TaskFormComponent } from '../../shared/task-form/task-form.component'
import { TasksService } from '../../core/tasks.service'

@Component({
  selector: 'app-contact-detail',
  standalone: true,
  imports: [
    ContactFormComponent,
    DatePipe,
    LayoutComponent,
    LineBreakPipe,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    TaskFormComponent,
    TasksTableComponent,
  ],
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.css',
})
export class ContactDetailComponent implements OnInit {
  @ViewChild(ContactFormComponent) contactForm: ContactFormComponent = {} as ContactFormComponent
  @ViewChild('taskForm') taskForm: TaskFormComponent = {} as TaskFormComponent
  @ViewChild(TasksTableComponent) taskTable: TasksTableComponent = {} as TasksTableComponent

  private activatedRoute = inject(ActivatedRoute)
  private contactService = inject(ContactService)
  private tasksService = inject(TasksService)

  protected contactId = ''
  protected contact: IContact = {} as IContact
  protected editMode = false
  protected addTaskMode = false

  public ngOnInit(): void {
    this.contactId = this.activatedRoute.snapshot.params['contactId']

    if (!this.contactId) return

    this.getContact().subscribe()
  }

  protected onSave() {
    this.contactService.updateContact({ ...this.contactForm.form.value, key: this.contactId } as IContact)
      .pipe(switchMap(() => this.getContact()))
      .subscribe({
        next: () => this.editMode = false,
      })
  }

  protected onAddTask() {
    if (this.taskForm.form.invalid) return

    this.tasksService.addTask({ ...this.taskForm.form.value, contact_id: this.contactId })
      .subscribe({
        next: (response) => {
          if (response.statusCode === 201) {
            this.addTaskMode = false
          }
        },
      })
  }

  private getContact() {
    return this.contactService.getContact(this.contactId)
      .pipe(tap(data => this.contact = data.contact))
  }
}
