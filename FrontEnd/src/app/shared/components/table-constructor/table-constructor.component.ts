import { CommonModule, NgFor, NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/core/services/GeneralServices/general-services.service';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-table-constructor',
  imports: [CommonModule, FormsModule],
  templateUrl: './table-constructor.component.html',
  styleUrl: './table-constructor.component.css',
})
export class TableConstructorComponent implements OnInit {
  @Input() columns: { key: string; label: string; tooltip?: string }[] = [];
  @Input() data: any[] = [];
  @Input() currentPage: any = 0;
  @Input() maxPage: any = 10;
  @Input() editRoute: String = '/';
  @Input() deleteFunction: (row: any) => void = () => {};
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<{ size: number; page: number }>();

  constructor(
    private router: Router,
    private generalService: GeneralService,
    private loaderService: LoaderService,
  ) {}

  selectedResults: number = 5;
  resultOptions = [5, 10, 20];
  imagenCargada: { [id: string]: boolean } = {};
  imagenFallida: { [id: string]: boolean } = {};
  openMenuIndex: number | null = null;
  isLoading: boolean = true;

  getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }
  toggleMenu(index: number) {
    this.openMenuIndex = this.openMenuIndex === index ? null : index;
  }
  ngOnInit(): void {
    this.loaderService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = (event.target as HTMLElement).closest('.action-menu');
    const clickedpoint = (event.target as HTMLElement).closest('.action-icon');
    if (!clickedInside && !clickedpoint) {
      this.closeMenu();
    }
  }
  getInitials(nombre: string): string {
    if (!nombre) return 'JG';
    const palabras = nombre.trim().split(' ');
    const iniciales = palabras.map((p) => p[0]).join('');
    return iniciales.substring(0, 2).toUpperCase();
  }
  onImageError(id: string): void {
    this.imagenFallida[id] = true;
  }
  closeMenu() {
    this.openMenuIndex = null;
  }

  editItem(row: any) {
    this.generalService.setObjecttoEdit(row);
    this.router.navigate([this.editRoute]);
  }

  deleteItem(row: any) {
    this.deleteFunction(row);
  }

  nextPage() {
    if (this.currentPage < this.maxPage) {
      this.currentPage++;
      this.pageChange.emit(this.currentPage);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.pageChange.emit(this.currentPage);
    }
  }
  onPageSizeChange(): void {
    this.pageSizeChange.emit({
      size: this.selectedResults,
      page: this.currentPage,
    });
  }
}
