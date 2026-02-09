import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/core/interfaces/clientes';
import { ClientesService } from 'src/app/core/services/clientes/clientes.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { SearchComponent } from 'src/app/shared/components/search/search.component';
import { TableConstructorComponent } from 'src/app/shared/components/table-constructor/table-constructor.component';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { GeneralService } from 'src/app/core/services/GeneralServices/general-services.service';
import { DeleteConstructorComponent } from 'src/app/shared/components/delete-constructor/delete-constructor.component';

@Component({
  selector: 'app-clientes-list',
  imports: [
    TableConstructorComponent,
    SearchComponent,
    DeleteConstructorComponent,
  ],
  templateUrl: './clientes-list.component.html',
  styleUrl: './clientes-list.component.css',
})
export class ClientesListComponent {
  private searchSubject = new Subject<string>();
  constructor(
    private ClientesService: ClientesService,
    private router: Router,
    private Loader: LoaderService,
    private generalService: GeneralService,
  ) {}
  searchTerm: string = '';
  filteredRows: any[] = [];
  showDeleteModal: boolean = false;
  selectedClient: any = null;
  rows: Cliente[] = [];
  currentPage: number = 1;
  maxPage: number = 1;
  pageSize: number = 5;
  serachTerm: string = '';

  ngOnInit(): void {
    this.searchSubject
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((term) => {
        this.executeSearch(term);
      });
    this.filteredRows = [...this.rows];
    this.cargarClientes();
  }

  searchChange(term: string) {
    this.searchSubject.next(term);
  }

  private async executeSearch(term: string) {
    this.Loader.show();
    this.serachTerm = term;

    if (term === '') {
      this.currentPage = 1;
      await this.cargarClientes();
    } else {
      this.currentPage = 1;

      const response = await this.ClientesService.loadPaginatedClientesById(
        term,
        this.currentPage - 1,
        this.pageSize,
      );

      this.filteredRows = response?.clientes ?? [];
      this.rows = [...this.filteredRows];
      this.maxPage = response?.totalPages ?? 1;
    }

    this.Loader.hide();
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    if (this.serachTerm !== '') {
      this.searchChange(this.serachTerm);
    } else {
      this.cargarClientes();
    }
  }

  goToAddClient() {
    this.router.navigate(['/addClient']);
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
    {
      key: 'identificacion',
      label: 'Identificación',
      tooltip: 'Número de identificación del cliente',
    },

    { key: 'nombre', label: 'nombre' },
    { key: 'edad', label: 'Edad' },
    { key: 'genero', label: 'Género' },
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
    this.generalService.setDelObject(Cliente);

    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.selectedClient = null;
  }

  async deleteClient(id: any): Promise<void> {
    await this.ClientesService.deleteClient(id);
    this.generalService.clearDelObj();
    this.showDeleteModal = false;
    this.selectedClient = null;
    this.cargarClientes();
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
