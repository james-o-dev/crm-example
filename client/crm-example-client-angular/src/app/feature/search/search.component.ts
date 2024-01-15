import { Component, OnInit, inject } from '@angular/core'
import { LayoutComponent } from '../../shared/layout/layout.component'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon'
import { MatTableModule } from '@angular/material/table'
import { ISearchResponse, SearchService } from './search.service'
import { Router } from '@angular/router'
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { debounceTime, distinctUntilChanged } from 'rxjs'
import { MatButtonModule } from '@angular/material/button'

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    FormsModule,
    LayoutComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    ReactiveFormsModule,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit {
  private formBuilder = inject(FormBuilder)
  private router = inject(Router)
  private searchService = inject(SearchService)

  protected COLUMNS = [
    'name',
    'type',
  ]

  protected dataSource: ISearchResponse[] = []

  protected form = this.formBuilder.group({ q: [''] })

  public ngOnInit(): void {
    this.form.controls.q.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(300),
      )
      .subscribe(() => this.loadSearchList())
  }

  private loadSearchList() {
    const q = this.form.value.q

    if (!q) {
      this.dataSource = []
      return
    }

    this.searchService.search(q as string)
      .subscribe((response) => {
        if (response.statusCode === 200) this.dataSource = response.found as ISearchResponse[]
        else this.dataSource = []
      })
  }

  protected onNavigateToRecord(element: ISearchResponse) {
    let route

    switch (element.type) {
      case 'contact':
        route = '/contact-detail'
        break

      case 'task':
        route = '/task-detail'
        break

      default:
        break
    }

    if (route) {
      this.router.navigate([route, element.key])
    }
  }
}
