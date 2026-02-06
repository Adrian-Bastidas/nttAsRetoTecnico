import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteProductComponent } from './delete-product.component';
import {
  ProductoInternalService,
  ProductService,
} from 'src/app/core/services/products.service';
import { of } from 'rxjs';
import { Product } from 'src/app/core/interfaces/product';
import { By } from '@angular/platform-browser';

describe('DeleteProductComponent (Jest)', () => {
  let component: DeleteProductComponent;
  let fixture: ComponentFixture<DeleteProductComponent>;

  const dummyProduct: Product = {
    id: 'ID001',
    name: 'Nuevo Producto',
    description: 'Descripción válida',
    logo: 'logo.png',
    date_release: '2025-04-14',
    date_revision: '2026-04-14',
  };

  const productoInternalServiceMock = {
    getProductoObservable: jest.fn(),
    clearDelProducto: jest.fn(),
  };

  const productServiceMock = {
    deleteProduct: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [DeleteProductComponent],
      providers: [
        {
          provide: ProductoInternalService,
          useValue: productoInternalServiceMock,
        },
        { provide: ProductService, useValue: productServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteProductComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería mostrar el modal si hay un producto para eliminar', () => {
    productoInternalServiceMock.getProductoObservable.mockReturnValue(
      of(dummyProduct)
    );
    fixture.detectChanges();

    const title = fixture.debugElement.query(By.css('.modal-title'));
    expect(title.nativeElement.textContent).toContain(
      `¿Estás seguro de eliminar el producto ${dummyProduct.name}?`
    );
  });

  it('debería llamar a clearDelProducto al cancelar', () => {
    productoInternalServiceMock.getProductoObservable.mockReturnValue(
      of(dummyProduct)
    );
    fixture.detectChanges();

    const cancelButton = fixture.debugElement.query(By.css('.cancel-button'));
    cancelButton.nativeElement.click();

    expect(productoInternalServiceMock.clearDelProducto).toHaveBeenCalled();
  });

  it('debería eliminar el producto y emitir evento al confirmar', async () => {
    productoInternalServiceMock.getProductoObservable.mockReturnValue(
      of(dummyProduct)
    );
    productServiceMock.deleteProduct.mockResolvedValue(true);
    const emitSpy = jest.spyOn(component.productoEliminado, 'emit');

    fixture.detectChanges();

    const confirmButton = fixture.debugElement.query(By.css('.confirm-button'));
    confirmButton.nativeElement.click();

    await fixture.whenStable();

    expect(productServiceMock.deleteProduct).toHaveBeenCalledWith(
      dummyProduct.id
    );
    expect(productoInternalServiceMock.clearDelProducto).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalled();
  });
});
