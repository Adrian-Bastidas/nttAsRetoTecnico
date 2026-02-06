import { Routes } from '@angular/router';
import { CreateProductComponent } from './features/products/components/create-product/create-product.component';
import { ClientesListComponent } from './features/clientes/componentes/clientes-list/clientes-list.component';

export const routes: Routes = [
  {
    path: '',
    component: ClientesListComponent,
  },
  {
    path: 'add',
    component: CreateProductComponent,
  },
];
