import { Routes } from '@angular/router';
import { ClientesListComponent } from './features/clientes/componentes/clientes-list/clientes-list.component';
import { CreateClientComponent } from './features/clientes/componentes/create-client/create-client.component';
import { CuentasListComponent } from './features/cuentas/componentes/cuentas-list/cuentas-list.component';
import { CreateCuentasComponent } from './features/cuentas/componentes/create-cuentas/create-cuentas.component';
import { MovimientosListComponent } from './features/movimientos/componentes/movimientos-list/movimientos-list.component';
import { CreateMovimientoComponent } from './features/movimientos/componentes/create-movimiento/create-movimiento.component';

export const routes: Routes = [
  {
    path: '',
    component: ClientesListComponent,
  },
  {
    path: 'addClient',
    component: CreateClientComponent,
  },
  {
    path: 'cuentas',
    component: CuentasListComponent,
  },
  {
    path: 'addCuenta',
    component: CreateCuentasComponent,
  },
  {
    path: 'movimientos',
    component: MovimientosListComponent,
  },
  {
    path: 'addMovimiento',
    component: CreateMovimientoComponent,
  },
];
