import { Routes } from '@angular/router';
import { ClientesListComponent } from './features/clientes/componentes/clientes-list/clientes-list.component';
import { CreateClientComponent } from './features/clientes/componentes/create-client/create-client.component';

export const routes: Routes = [
  {
    path: '',
    component: ClientesListComponent,
  },
  {
    path: 'addClient',
    component: CreateClientComponent,
  },
];
