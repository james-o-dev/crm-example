import { ChangeDetectionStrategy, Component, OnInit, ViewChild, inject, signal } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { ContactService, IGetContact, IUpdateContactPayload } from '../../core/contacts.service'
import { ActivatedRoute, Router } from '@angular/router'
import { ContactFormComponent } from '../../shared/contact-form/contact-form.component'
import { switchMap, tap } from 'rxjs'
import { LineBreakPipe } from '../../shared/line-break.pipe'
import { MatDividerModule } from '@angular/material/divider'
import { TasksTableComponent } from '../../shared/tasks-table/tasks-table.component'
import { TaskFormComponent } from '../../shared/task-form/task-form.component'
import { TasksService } from '../../core/tasks.service'
import { DateFnsPipe } from '../../shared/date-fns.pipe'
import { NotificationsService } from '../../core/notifications.service'
import { DialogService } from '../../shared/dialog/dialog.service'

@Component({
  selector: 'app-contact-detail',
  standalone: true,
  imports: [
    ContactFormComponent,
    DateFnsPipe,
    LineBreakPipe,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    TaskFormComponent,
    TasksTableComponent,
  ],
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactDetailComponent implements OnInit {
  @ViewChild('contactForm') contactForm: ContactFormComponent = {} as ContactFormComponent
  @ViewChild('taskForm') taskForm: TaskFormComponent = {} as TaskFormComponent
  @ViewChild(TasksTableComponent) taskTable: TasksTableComponent = {} as TasksTableComponent

  private activatedRoute = inject(ActivatedRoute)
  private contactService = inject(ContactService)
  private dialog = inject(DialogService)
  private notificationsService = inject(NotificationsService)
  private router = inject(Router)
  private tasksService = inject(TasksService)

  protected contactId = signal('')
  protected contact = signal<IGetContact>({} as IGetContact)
  protected editMode = false
  protected addTaskMode = signal(false)

  public ngOnInit(): void {
    this.contactId.set(this.activatedRoute.snapshot.params['contactId'])

    if (!this.contactId()) return

    this.getContact().subscribe()
  }

  protected onSave() {
    if (this.contactForm.form.invalid) return

    const payload = { ...this.contactForm.form.value, contact_id: this.contactId() } as IUpdateContactPayload
    this.contactService.updateContact(payload)
      .pipe(switchMap(() => this.getContact()))
      .subscribe({
        next: () => this.editMode = false,
        error: (response) => this.dialog.displayErrorDialog(response.error.message),
      })
  }

  protected onAddTask() {
    if (this.taskForm.form.invalid) return

    this.tasksService.addTask({ ...this.taskForm.form.value, contact_id: this.contactId() })
      .subscribe({
        next: () => {
          this.notificationsService.triggerNumberUpdateEvent()
          this.addTaskMode.set(false)
        },
      })
  }

  private getContact() {
    return this.contactService.getContact(this.contactId())
      .pipe(tap(data => this.contact.set(data.contact)))
  }

  protected archiveContact() {
    this.contactService.archiveContact(this.contactId())
      .subscribe(() => this.router.navigate(['/contacts']))
  }

  protected restoreContact() {
    this.contactService.restoreContact(this.contactId())
      .subscribe(() => this.router.navigate(['/contacts']))
  }
}
