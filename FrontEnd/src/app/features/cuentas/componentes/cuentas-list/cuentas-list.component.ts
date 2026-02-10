import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { CuentaResponseVo } from 'src/app/core/interfaces/cuentas';
import { ClientesService } from 'src/app/core/services/clientes/clientes.service';
import { CuentasService } from 'src/app/core/services/cuentas/cuentas.service';
import { GeneralService } from 'src/app/core/services/GeneralServices/general-services.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { DeleteConstructorComponent } from 'src/app/shared/components/delete-constructor/delete-constructor.component';
import { SearchComponent } from 'src/app/shared/components/search/search.component';
import { TableConstructorComponent } from 'src/app/shared/components/table-constructor/table-constructor.component';

@Component({
  selector: 'app-cuentas-list',
  imports: [
    TableConstructorComponent,
    SearchComponent,
    DeleteConstructorComponent,
  ],
  templateUrl: './cuentas-list.component.html',
  styleUrl: './cuentas-list.component.css',
})
export class CuentasListComponent {
  private searchSubject = new Subject<string>();
  constructor(
    private ClientesService: ClientesService,
    private CuentasService: CuentasService,
    private router: Router,
    private Loader: LoaderService,
    private generalService: GeneralService,
  ) {}
  searchTerm: string = '';
  filteredRows: any[] = [];
  showDeleteModal: boolean = false;
  selectedClient: any = null;
  rows: CuentaResponseVo[] = [];
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
    this.cargarCuentas();
  }

  searchChange(term: string) {
    this.searchSubject.next(term);
  }

  private async executeSearch(term: string) {
    this.Loader.show();
    this.serachTerm = term;

    if (term === '') {
      this.currentPage = 1;
      await this.cargarCuentas();
    } else {
      this.currentPage = 1;

      const response = await this.CuentasService.loadPaginatedCuentasById(
        term,
        this.currentPage - 1,
        this.pageSize,
      );

      this.filteredRows = response?.cuentas ?? [];
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
      this.cargarCuentas();
    }
  }

  goToAddCuenta() {
    this.router.navigate(['/addCuenta']);
  }

  clientes: CuentaResponseVo[] = [];
  async cargarCuentas(): Promise<void> {
    this.Loader.show();
    const response = await this.CuentasService.loadPaginatedCuentas(
      this.currentPage - 1,
      this.pageSize,
    );
    const cuentas = response?.cuentas ?? [];
    this.rows = [...cuentas];
    this.filteredRows = [...cuentas];
    this.maxPage = response?.totalPages ?? 1;
    this.Loader.hide();
  }
  columns = [
    {
      key: 'numeroCuenta',
      label: 'Número de Cuenta',
      tooltip: 'Número de cuenta del cliente',
    },

    { key: 'tipoCuenta', label: 'Tipo de Cuenta' },
    { key: 'saldoInicial', label: 'Saldo inicial $' },
    { key: 'cliente.nombre', label: 'Cliente' },
  ];

  openDeleteModal(Cuenta: any): void {
    this.generalService.setDelObject(Cuenta);

    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.selectedClient = null;
  }

  async deleteClient(id: any): Promise<void> {
    await this.CuentasService.deleteCuenta(id);
    this.generalService.clearDelObj();
    this.showDeleteModal = false;
    this.selectedClient = null;
    this.cargarCuentas();
  }
  onPageSizeChange(event: { size: number; page: number }): void {
    this.pageSize = event.size;
    this.currentPage = event.page;
    if (this.serachTerm !== '') {
      this.searchChange(this.serachTerm);
    } else {
      this.cargarCuentas();
    }
  }
}
