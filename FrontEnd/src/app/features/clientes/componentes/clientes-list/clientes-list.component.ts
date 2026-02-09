import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/core/interfaces/clientes';
import { ClientesService } from 'src/app/core/services/clientes/clientes.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { ProductoInternalService } from 'src/app/core/services/products.service';
import { DeleteProductComponent } from 'src/app/features/products/components/delete-product/delete-product.component';
import { SearchComponent } from 'src/app/shared/components/search/search.component';
import { TableConstructorComponent } from 'src/app/shared/components/table-constructor/table-constructor.component';

@Component({
  selector: 'app-clientes-list',
  imports: [TableConstructorComponent, SearchComponent, DeleteProductComponent],
  templateUrl: './clientes-list.component.html',
  styleUrl: './clientes-list.component.css',
})
export class ClientesListComponent {
  constructor(
    private ClientesService: ClientesService,
    private router: Router,
    private productoService: ProductoInternalService,
    private Loader: LoaderService,
  ) {}
  searchTerm: string = '';
  filteredRows: any[] = [];
  showDeleteModal: boolean = false;
  selectedProduct: any = null;
  rows: Cliente[] = [];
  currentPage: number = 1;
  maxPage: number = 1;
  pageSize: number = 5;
  serachTerm: string = '';

  ngOnInit(): void {
    this.filteredRows = [...this.rows];
    this.cargarClientes();
  }

  async searchChange(term: string) {
    this.Loader.show();
    this.serachTerm = term;
    if (term === '') {
      this.cargarClientes();
    } else {
      this.currentPage = 1;
      const response = await this.ClientesService.loadPaginatedClientesById(
        term,
        this.currentPage - 1,
        this.pageSize,
      );
      this.filteredRows = response?.clientes;
      this.rows = [...response?.clientes];
      this.maxPage = response?.totalPages ?? 1;
    }

    this.Loader.hide();
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    if (this.serachTerm !== '') {
      this.searchChange(this.serachTerm);
    } else {
      this.cargarClientes();
    }
  }

  goToAddProduct() {
    this.router.navigate(['/add']);
  }

  clientes: Cliente[] = [];
  async cargarClientes(): Promise<void> {
    this.Loader.show();
    const response = await this.ClientesService.loadPaginatedClientes(
      this.currentPage - 1,
      this.pageSize,
    );
    const clientes = response?.clientes ?? [];
    this.rows = [...clientes];
    this.filteredRows = [...clientes];
    this.maxPage = response?.totalPages ?? 1;
    this.Loader.hide();
  }
  columns = [
    { key: 'clienteId', label: 'Id de Cliente' },
    { key: 'nombre', label: 'nombre' },
    {
      key: 'identificacion',
      label: 'Identificación',
      tooltip: 'Número de identificación del cliente',
    },
    {
      key: 'direccion',
      label: 'Dirección',
      tooltip: 'Dirección del cliente',
    },
    {
      key: 'telefono',
      label: 'Teléfono',
      tooltip: 'Número de teléfono del cliente',
    },
  ];

  openDeleteModal(Cliente: any): void {
    this.productoService.setDelProducto(Cliente);

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
  onPageSizeChange(event: { size: number; page: number }): void {
    this.pageSize = event.size;
    this.currentPage = event.page;
    if (this.serachTerm !== '') {
      this.searchChange(this.serachTerm);
    } else {
      this.cargarClientes();
    }
  }
}
