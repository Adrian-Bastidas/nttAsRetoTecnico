import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { CuentaResponseVo } from 'src/app/core/interfaces/cuentas';
import { Movimientos } from 'src/app/core/interfaces/movimientos';
import { ClientesService } from 'src/app/core/services/clientes/clientes.service';
import { CuentasService } from 'src/app/core/services/cuentas/cuentas.service';
import { GeneralService } from 'src/app/core/services/GeneralServices/general-services.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { MovimientosService } from 'src/app/core/services/movimientos/movimientos.service';
import { DeleteConstructorComponent } from 'src/app/shared/components/delete-constructor/delete-constructor.component';
import { SearchComponent } from 'src/app/shared/components/search/search.component';
import { TableConstructorComponent } from 'src/app/shared/components/table-constructor/table-constructor.component';

@Component({
  selector: 'app-movimientos-list',
  imports: [
    TableConstructorComponent,
    SearchComponent,
    DeleteConstructorComponent,
  ],
  templateUrl: './movimientos-list.component.html',
  styleUrl: './movimientos-list.component.css',
})
export class MovimientosListComponent {
  private searchSubject = new Subject<string>();
  constructor(
    private CuentasService: CuentasService,
    private movimientosService: MovimientosService,
    private router: Router,
    private Loader: LoaderService,
    private generalService: GeneralService,
  ) {}
  searchTerm: string = '';
  filteredRows: any[] = [];
  showDeleteModal: boolean = false;
  selectedClient: any = null;
  rows: Movimientos[] = [];
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
    this.cargarMovimientos();
  }

  searchChange(term: string) {
    this.searchSubject.next(term);
  }

  private async executeSearch(term: string) {
    this.Loader.show();
    this.serachTerm = term;

    if (term === '') {
      this.currentPage = 1;
      await this.cargarMovimientos();
    } else {
      this.currentPage = 1;

      const response =
        await this.movimientosService.loadPaginatedMovimientosById(
          term,
          this.currentPage - 1,
          this.pageSize,
        );

      this.filteredRows = response?.movimientos ?? [];
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
      this.cargarMovimientos();
    }
  }

  goToAddCuenta() {
    this.router.navigate(['/addCuenta']);
  }

  clientes: Movimientos[] = [];
  async cargarMovimientos(): Promise<void> {
    this.Loader.show();
    const response = await this.movimientosService.loadPaginatedCuentas(
      this.currentPage - 1,
      this.pageSize,
    );
    const movimientos = response?.movimientos ?? [];
    this.rows = [...movimientos];
    this.filteredRows = [...movimientos];
    this.maxPage = response?.totalPages ?? 1;
    this.Loader.hide();
  }
  columns = [
    {
      key: 'numeroCuenta',
      label: 'Número de Cuenta',
      tooltip: 'Número de cuenta del cliente',
    },

    { key: 'tipo', label: 'Tipo de Cuenta' },
    { key: 'saldo', label: 'Saldo $' },
    { key: 'movimiento', label: 'Movimiento' },
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
    this.cargarMovimientos();
  }
  onPageSizeChange(event: { size: number; page: number }): void {
    this.pageSize = event.size;
    this.currentPage = event.page;
    if (this.serachTerm !== '') {
      this.searchChange(this.serachTerm);
    } else {
      this.cargarMovimientos();
    }
  }
}
