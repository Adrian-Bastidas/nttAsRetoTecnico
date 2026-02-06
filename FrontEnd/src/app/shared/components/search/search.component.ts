import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-search',
  imports: [FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  private searchSubject = new Subject<string>();
  constructor() {
    this.searchSubject.pipe(debounceTime(300)).subscribe((value) => {
      this.searchChange.emit(value);
    });
  }

  searchTerm: string = '';

  @Input() placeholder: string = 'Buscar...';
  @Input() ariaLabel: string = 'Buscar';
  @Output() searchChange = new EventEmitter<string>();

  onSearch(value: string) {
    this.searchSubject.next(value);
  }
}
