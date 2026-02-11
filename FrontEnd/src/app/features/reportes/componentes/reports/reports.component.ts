import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { FormButton, FormField } from 'src/app/core/interfaces/form';
import { ClientesService } from 'src/app/core/services/clientes/clientes.service';
import { CuentasService } from 'src/app/core/services/cuentas/cuentas.service';
import {
  FormConstructorComponent,
  SearchConfig,
} from 'src/app/shared/components/form-constructor/form-constructor.component';
import { ShortPopUpComponent } from 'src/app/shared/components/short-pop-up/short-pop-up.component';
import { TableConstructorComponent } from 'src/app/shared/components/table-constructor/table-constructor.component';

@Component({
  selector: 'app-reports',
  imports: [
    CommonModule,
    FormConstructorComponent,
    ShortPopUpComponent,
    TableConstructorComponent,
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent implements OnInit {
  @Output() applyFilters = new EventEmitter<any>();
  @ViewChild(FormConstructorComponent)
  formConstructor!: FormConstructorComponent;

  filterForm!: FormGroup;
  fields: FormField[] = [];
  buttons: FormButton[] = [];
  fechaInicioSeleccionada: string = '';

  showTable: boolean = false;
  filteredRows: any[] = [];
  currentPage: number = 1;
  maxPage: number = 1;
  pageSize: number = 5;

  currentClienteId: string = '0';
  currentFechaInicio: string = '';
  currentFechaFin: string = '';

  searchConfig: SearchConfig = {
    enabled: true,
    fieldName: 'cliente',
    label: 'Buscar Cliente',
    placeholder: 'Ingrese la identificación del cliente',
    infoFields: [
      { label: 'Nombre', key: 'nombre' },
      { label: 'Identificación', key: 'identificacion' },
      { label: 'Teléfono', key: 'telefono' },
    ],
  };

  mostrarPopup: boolean = false;
  message: string = '';
  typeModal: string = 'error';

  columns = [
    {
      key: 'fecha',
      label: 'Fecha',
      tooltip: 'Fecha del movimiento',
    },
    {
      key: 'cliente',
      label: 'Cliente',
      tooltip: 'Nombre del cliente',
    },
    {
      key: 'numeroCuenta',
      label: 'Número de Cuenta',
      tooltip: 'Número de cuenta',
    },
    {
      key: 'tipo',
      label: 'Tipo de Cuenta',
      tooltip: 'Tipo de cuenta',
    },
    {
      key: 'saldoInicial',
      label: 'Saldo Inicial $',
      tooltip: 'Saldo inicial',
    },
    {
      key: 'movimiento',
      label: 'Movimiento $',
      tooltip: 'Valor del movimiento',
    },
    {
      key: 'saldoDisponible',
      label: 'Saldo Disponible $',
      tooltip: 'Saldo disponible después del movimiento',
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private clientService: ClientesService,
    private cuentasService: CuentasService,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.initializeFormFields();
    this.initializeFormButtons();
    this.setupDateValidation();
  }

  private initializeForm(): void {
    this.filterForm = this.formBuilder.group(
      {
        fechaInicio: ['', Validators.required],
        fechaFin: ['', Validators.required],
      },
      { validators: this.fechaFinValidator() },
    );
  }

  private fechaFinValidator() {
    return (group: AbstractControl): ValidationErrors | null => {
      const fechaInicio = group.get('fechaInicio')?.value;
      const fechaFin = group.get('fechaFin')?.value;

      if (fechaInicio && fechaFin) {
        if (fechaFin < fechaInicio) {
          group.get('fechaFin')?.setErrors({ fechaFinMenor: true });
          return { fechaFinMenor: true };
        } else {
          const errors = group.get('fechaFin')?.errors;
          if (errors) {
            delete errors['fechaFinMenor'];
            if (Object.keys(errors).length === 0) {
              group.get('fechaFin')?.setErrors(null);
            }
          }
        }
      }
      return null;
    };
  }

  private initializeFormFields(): void {
    this.fields = [
      {
        name: 'fechaInicio',
        label: 'Fecha Inicio',
        type: 'date',
        placeholder: 'Seleccione fecha inicio',
        errorMessage: 'Fecha inicio es requerida',
      },
      {
        name: 'fechaFin',
        label: 'Fecha Fin',
        type: 'date',
        placeholder: 'Seleccione fecha fin',
        errorMessage: 'Fecha fin no puede ser anterior a la fecha inicio',
        readonly: !this.fechaInicioSeleccionada,
      },
    ];
  }

  private setupDateValidation(): void {
    this.filterForm.get('fechaInicio')?.valueChanges.subscribe((value) => {
      this.fechaInicioSeleccionada = value;
      const fechaFinControl = this.filterForm.get('fechaFin');

      if (value) {
        fechaFinControl?.enable();
        this.fields[1].readonly = false;
      } else {
        fechaFinControl?.disable();
        fechaFinControl?.setValue('');
        this.fields[1].readonly = true;
      }

      this.filterForm.updateValueAndValidity();
    });

    this.filterForm.get('fechaFin')?.valueChanges.subscribe(() => {
      this.filterForm.updateValueAndValidity();
    });
  }

  private initializeFormButtons(): void {
    this.buttons = [
      {
        label: 'Limpiar',
        type: 'button',
        class: 'btn-reset',
        action: this.limpiarFiltros.bind(this),
      },
      {
        label: 'Aplicar Filtros',
        type: 'submit',
        class: 'btn-submit',
        action: this.aplicarFiltros.bind(this),
      },
    ];
  }

  async onSearch(cliente: string): Promise<void> {
    try {
      const response = await this.clientService.loadClientesById(cliente);

      if (response && response.clienteId) {
        this.formConstructor.setSearchData(response);
        this.showSuccess('Cliente encontrado correctamente');
      } else {
        this.formConstructor.clearSearchData();
      }
    } catch (error) {
      console.error('Error buscando cliente:', error);
      this.showError('Error al buscar el cliente');
      this.formConstructor.clearSearchData();
    }
  }

  async aplicarFiltros(): Promise<void> {
    if (this.filterForm.valid) {
      if (!this.formConstructor.searchData) {
        this.showError(
          'Debe buscar y seleccionar un cliente antes de aplicar filtros',
        );
        return;
      }

      try {
        const clienteId = this.formConstructor.searchData.clienteId;
        const fechaInicio = this.filterForm.get('fechaInicio')?.value;
        const fechaFin = this.filterForm.get('fechaFin')?.value;

        this.currentClienteId = clienteId;
        this.currentFechaInicio = fechaInicio;
        this.currentFechaFin = fechaFin;

        await this.cargarReporte(
          clienteId,
          fechaInicio,
          fechaFin,
          0,
          this.pageSize,
        );

        this.showTable = true;
      } catch (error) {
        console.error('Error al aplicar filtros:', error);
        this.showError('Error al cargar el reporte');
      }
    } else {
      this.showError('Por favor complete todos los campos requeridos');
    }
  }

  private async cargarReporte(
    clienteId: string,
    fechaInicio: string,
    fechaFin: string,
    page: number,
    size: number,
  ): Promise<void> {
    const response = await this.cuentasService.loadPaginatedReports(
      clienteId,
      fechaInicio,
      fechaFin,
      page,
      size,
    );

    if (response && response.reportes) {
      this.filteredRows = response.reportes.map((reporte: any) => ({
        ...reporte,
        fecha: this.formatDate(reporte.fecha),
      }));
      this.maxPage = response.totalPages;
      this.currentPage = page + 1;
    }
  }
  private formatDate(date: string | Date): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.cargarReporte(
      this.currentClienteId,
      this.currentFechaInicio,
      this.currentFechaFin,
      newPage - 1,
      this.pageSize,
    );
  }

  onPageSizeChange(event: { size: number; page: number }): void {
    this.pageSize = event.size;
    this.currentPage = event.page;
    this.cargarReporte(
      this.currentClienteId,
      this.currentFechaInicio,
      this.currentFechaFin,
      event.page - 1,
      event.size,
    );
  }

  volverAFiltros(): void {
    this.showTable = false;
  }
  descargarReporte(): void {
    try {
      this.cuentasService
        .descargarReportePdf(
          this.currentClienteId,
          this.currentFechaInicio,
          this.currentFechaFin,
        )
        .then(() => {
          this.showSuccess('Reporte descargado correctamente');
        })
        .catch((error) => {
          console.error('Error al descargar:', error);
          this.showError('Error al descargar el reporte');
        });
    } catch (error) {
      console.error('Error:', error);
      this.showError('Error al descargar el reporte');
    }
  }

  limpiarFiltros(): void {
    this.filterForm.reset();
    this.fechaInicioSeleccionada = '';
    this.formConstructor.clearSearchData();
    this.showTable = false;

    const fechaFinControl = this.filterForm.get('fechaFin');
    fechaFinControl?.disable();
    this.fields[1].readonly = true;
  }

  private showError(message: string): void {
    this.typeModal = 'error';
    this.message = message;
    this.abrirPopup();
  }

  private showSuccess(message: string): void {
    this.typeModal = 'success';
    this.message = message;
    this.abrirPopup();
  }

  abrirPopup(): void {
    this.mostrarPopup = true;
  }
}
