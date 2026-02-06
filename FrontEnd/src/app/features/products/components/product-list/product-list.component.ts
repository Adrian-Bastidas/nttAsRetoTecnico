import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TableConstructorComponent } from '../../../../shared/components/table-constructor/table-constructor.component';
import { SearchComponent } from '../../../../shared/components/search/search.component';
import {
  ProductoInternalService,
  ProductService,
} from '../../../../core/services/products.service';
import { Product } from '../../../../core/interfaces/product';
import { Router } from '@angular/router';
import { DeleteProductComponent } from '../delete-product/delete-product.component';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import axios from 'axios';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-product-list',
  imports: [TableConstructorComponent, SearchComponent, DeleteProductComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  constructor(
    private productService: ProductService,
    private router: Router,
    private productoService: ProductoInternalService,
    private Loader: LoaderService
  ) {}
  searchTerm: string = '';
  filteredRows: any[] = [];
  showDeleteModal: boolean = false;
  selectedProduct: any = null;
  rows: Product[] = [];

  ngOnInit(): void {
    this.filteredRows = [...this.rows];
    this.cargarProductos();
  }

  searchChange(term: string) {
    const lowerCaseTerm = term.toLowerCase();
    this.filteredRows = this.rows.filter((product) =>
      product.name.toLowerCase().includes(lowerCaseTerm)
    );
  }

  goToAddProduct() {
    this.router.navigate(['/add']);
  }

  productos: Product[] = [];
  async cargarProductos(): Promise<void> {
    this.Loader.show();
    const productos = await this.productService.loadProducts();
    this.rows = [...productos];
    this.filteredRows = [...productos];
    this.Loader.hide();
  }
  columns = [
    { key: 'logo', label: 'Logo' },
    { key: 'name', label: 'Nombre del producto' },
    {
      key: 'description',
      label: 'Descripción',
      tooltip: 'Información del producto',
    },
    {
      key: 'date_release',
      label: 'Fecha de liberación',
      tooltip: 'Fecha de lanzamiento',
    },
    {
      key: 'date_revision',
      label: 'Fecha de reestructuración',
      tooltip: 'Fecha de modificación',
    },
  ];

  openDeleteModal(product: any): void {
    this.productoService.setDelProducto(product);

    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.selectedProduct = null;
  }

  deleteProduct(productId: any): void {
    this.showDeleteModal = false;
    this.selectedProduct = null;
  }
}
