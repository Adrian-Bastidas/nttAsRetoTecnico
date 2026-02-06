import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/core/services/loader.service';
import { ProductoInternalService } from 'src/app/core/services/products.service';

@Component({
  selector: 'app-table-constructor',
  imports: [CommonModule, FormsModule],
  templateUrl: './table-constructor.component.html',
  styleUrl: './table-constructor.component.css',
})
export class TableConstructorComponent implements OnInit {
  @Input() columns: { key: string; label: string; tooltip?: string }[] = [];
  @Input() data: any[] = [];
  @Input() deleteFunction: (row: any) => void = () => {};

  constructor(
    private router: Router,
    private productoService: ProductoInternalService,
    private loaderService: LoaderService
  ) {}

  selectedResults: number = 5;
  resultOptions = [5, 10, 20];
  imagenCargada: { [id: string]: boolean } = {};
  imagenFallida: { [id: string]: boolean } = {};
  openMenuIndex: number | null = null;
  isLoading: boolean = true;

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
    this.productoService.setProducto(row);
    this.router.navigate(['/add']);
  }

  deleteItem(row: any) {
    this.deleteFunction(row);
  }
}
