import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Product } from 'src/app/core/interfaces/product';
import {
  ProductoInternalService,
  ProductService,
} from 'src/app/core/services/products.service';

@Component({
  selector: 'app-delete-product',
  imports: [CommonModule],
  templateUrl: './delete-product.component.html',
  styleUrl: './delete-product.component.css',
})
export class DeleteProductComponent implements OnInit {
  productoAEliminar: Product | null = null;
  @Output() productoEliminado = new EventEmitter<void>();

  constructor(
    private productoService: ProductoInternalService,
    private productService: ProductService
  ) {}
  ngOnInit(): void {
    this.productoService.getProductoObservable().subscribe((producto) => {
      this.productoAEliminar = producto;
    });
  }
  async onConfirm(): Promise<void> {
    if (this.productoAEliminar) {
      const response = await this.productService.deleteProduct(
        this.productoAEliminar.id
      );
      if (response) {
        this.productoService.clearDelProducto();
        this.productoEliminado.emit();
      }
    }
  }

  onCancel(): void {
    this.productoService.clearDelProducto();
  }
}
